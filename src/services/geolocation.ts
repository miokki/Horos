import axios, { AxiosError } from 'axios';
import NodeCache from 'node-cache';
import { env } from '../config/env';

interface GeocodeResult {
  latitude: number;
  longitude: number;
  altitude: number;
  displayName: string;
  timezone?: string;
}

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

interface ServiceConfig {
  defaultLocation: string;
  requestTimeout: number;
  rateLimitPerMinute: number;
}

class GeolocationService {
  private static readonly BASE_URL = 'https://nominatim.openstreetmap.org';
  private static readonly cache = new NodeCache({ stdTTL: 86400, checkperiod: 120 });
  private lastRequestTime: number = 0;
  private requestCount: number = 0;

  private readonly config: ServiceConfig = {
    defaultLocation: 'Warszawa, Polska',
    requestTimeout: 5000, // 5 sekund
    rateLimitPerMinute: 60
  };

  private axiosInstance = axios.create({
    baseURL: GeolocationService.BASE_URL,
    timeout: this.config.requestTimeout,
    headers: {
      'User-Agent': 'Horos-App/1.0'
    }
  });

  /**
   * Sprawdzenie limitu zapytań
   */
  private checkRateLimit(): void {
    const now = Date.now();
    const oneMinute = 60 * 1000;

    if (now - this.lastRequestTime > oneMinute) {
      // Resetuj licznik po minucie
      this.requestCount = 0;
      this.lastRequestTime = now;
    }

    if (this.requestCount >= this.config.rateLimitPerMinute) {
      throw new Error('Przekroczono limit zapytań. Spróbuj ponownie za chwilę.');
    }

    this.requestCount++;
    this.lastRequestTime = now;
  }

  /**
   * Obsługa błędów HTTP
   */
  private handleAxiosError(error: AxiosError): never {
    if (error.response) {
      // Odpowiedź serwera ze statusem błędu
      throw new Error(`Błąd serwera: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      // Brak odpowiedzi od serwera
      throw new Error('Brak odpowiedzi od serwera. Sprawdź połączenie z internetem.');
    } else {
      // Błąd konfiguracji żądania
      throw new Error(`Błąd konfiguracji: ${error.message}`);
    }
  }

  /**
   * Geokodowanie adresu lub nazwy miejsca
   */
  public async geocode(location: string): Promise<GeocodeResult> {
    // Sprawdź cache
    const cacheKey = `geocode:${location}`;
    const cachedResult = GeolocationService.cache.get<GeocodeResult>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    try {
      this.checkRateLimit();

      const response = await this.axiosInstance.get<NominatimResponse[]>('/search', {
        params: {
          q: location,
          format: 'json',
          limit: 1,
        }
      });

      const data = response.data;
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error(`Nie znaleziono lokalizacji: ${location}`);
      }

      const result = data[0];
      const geocodeResult: GeocodeResult = {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        altitude: 0,
        displayName: result.display_name,
      };

      // Zapisz w cache
      GeolocationService.cache.set(cacheKey, geocodeResult);

      return geocodeResult;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleAxiosError(error);
      }
      throw error;
    }
  }

  /**
   * Pobieranie aktualnej pozycji użytkownika (tylko w przeglądarce)
   */
  public getCurrentPosition(): Promise<GeocodeResult> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolokalizacja nie jest wspierana przez przeglądarkę'));
        return;
      }

      const options = {
        timeout: this.config.requestTimeout,
        maximumAge: 0,
        enableHighAccuracy: true
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            this.checkRateLimit();

            const response = await this.axiosInstance.get<NominatimResponse>('/reverse', {
              params: {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                format: 'json',
              }
            });

            const displayName = response.data?.display_name || this.config.defaultLocation;

            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude || 0,
              displayName,
            });
          } catch (error) {
            // W przypadku błędu reverse geocoding, zwróć podstawowe dane
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude || 0,
              displayName: this.config.defaultLocation,
            });
          }
        },
        (error) => {
          reject(new Error(`Błąd geolokalizacji: ${this.getPositionErrorMessage(error)}`));
        },
        options
      );
    });
  }

  /**
   * Pomocnicza metoda do tłumaczenia kodów błędów geolokalizacji
   */
  private getPositionErrorMessage(error: { code: number }): string {
    switch (error.code) {
      case 1: // PERMISSION_DENIED
        return 'Użytkownik odmówił dostępu do geolokalizacji';
      case 2: // POSITION_UNAVAILABLE
        return 'Informacja o lokalizacji jest niedostępna';
      case 3: // TIMEOUT
        return 'Przekroczono czas oczekiwania na dane o lokalizacji';
      default:
        return 'Wystąpił nieznany błąd';
    }
  }
}

export default new GeolocationService();
