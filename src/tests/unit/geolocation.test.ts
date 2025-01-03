import axios, { AxiosError } from 'axios';
import GeolocationService from '../../services/geolocation';
import { env } from '../../config/env';

// Mock dla axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock dla env
jest.mock('../../config/env', () => ({
  env: {
    VITE_DEFAULT_LOCATION: 'Warszawa, Polska',
    VITE_GEOLOCATION_TIMEOUT: 5000,
    VITE_GEOLOCATION_RATE_LIMIT: 60
  }
}));

describe('GeolocationService', () => {
  const mockNominatimResponse = [{
    lat: '52.2297',
    lon: '21.0122',
    display_name: 'Warszawa, Polska'
  }];

  beforeEach(() => {
    // Resetuj wszystkie mocki przed każdym testem
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('geocode', () => {
    it('powinien zwrócić dane geolokalizacyjne dla poprawnej lokalizacji', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockNominatimResponse });

      const result = await GeolocationService.geocode('Warszawa');

      expect(result).toEqual({
        latitude: 52.2297,
        longitude: 21.0122,
        altitude: 0,
        displayName: 'Warszawa, Polska'
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/search',
        expect.objectContaining({
          params: {
            q: 'Warszawa',
            format: 'json',
            limit: 1
          }
        })
      );
    });

    it('powinien użyć cache dla powtórnych zapytań', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockNominatimResponse });

      // Pierwsze zapytanie
      await GeolocationService.geocode('Warszawa');
      // Drugie zapytanie - powinno użyć cache
      await GeolocationService.geocode('Warszawa');

      // Axios.get powinien być wywołany tylko raz
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('powinien przestrzegać limitu zapytań', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockNominatimResponse });

      // Wykonaj maksymalną liczbę zapytań
      const promises = Array(env.VITE_GEOLOCATION_RATE_LIMIT)
        .fill(null)
        .map(() => GeolocationService.geocode('Warszawa'));

      await Promise.all(promises);

      // Kolejne zapytanie powinno zostać odrzucone
      await expect(GeolocationService.geocode('Warszawa'))
        .rejects
        .toThrow('Przekroczono limit zapytań');

      // Przesuń czas o minutę
      jest.advanceTimersByTime(60000);

      // Teraz powinno być możliwe wykonanie kolejnego zapytania
      await expect(GeolocationService.geocode('Warszawa')).resolves.toBeDefined();
    });

    it('powinien rzucić błąd gdy lokalizacja nie zostanie znaleziona', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await expect(GeolocationService.geocode('NieistniejąceMiasto'))
        .rejects
        .toThrow('Nie znaleziono lokalizacji: NieistniejąceMiasto');
    });

    it('powinien obsłużyć błędy HTTP', async () => {
      const networkError = new AxiosError(
        'Network Error',
        'ECONNABORTED',
        undefined,
        undefined,
        {
          status: 500,
          statusText: 'Internal Server Error',
          config: {} as any,
          headers: {},
          data: null
        }
      );
      mockedAxios.get.mockRejectedValueOnce(networkError);

      await expect(GeolocationService.geocode('Warszawa'))
        .rejects
        .toThrow('Błąd serwera: 500 - Internal Server Error');
    });

    it('powinien obsłużyć timeout', async () => {
      const timeoutError = new AxiosError(
        'timeout of 5000ms exceeded',
        'ECONNABORTED'
      );
      mockedAxios.get.mockRejectedValueOnce(timeoutError);

      await expect(GeolocationService.geocode('Warszawa'))
        .rejects
        .toThrow('Błąd konfiguracji: timeout of 5000ms exceeded');
    });
  });

  describe('getCurrentPosition', () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn()
    };

    beforeEach(() => {
      // Mock dla navigator.geolocation
      (global as any).navigator = {
        geolocation: mockGeolocation
      };
    });

    it('powinien pobrać aktualną pozycję użytkownika', async () => {
      const mockPosition = {
        coords: {
          latitude: 52.2297,
          longitude: 21.0122,
          altitude: null
        }
      };

      mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => 
        success(mockPosition)
      );

      mockedAxios.get.mockResolvedValueOnce({
        data: { display_name: 'Warszawa, Polska' }
      });

      const result = await GeolocationService.getCurrentPosition();

      expect(result).toEqual({
        latitude: 52.2297,
        longitude: 21.0122,
        altitude: 0,
        displayName: 'Warszawa, Polska'
      });

      // Sprawdź czy użyto odpowiednich opcji
      expect(mockGeolocation.getCurrentPosition.mock.calls[0][2]).toEqual({
        timeout: env.VITE_GEOLOCATION_TIMEOUT,
        maximumAge: 0,
        enableHighAccuracy: true
      });
    });

    it('powinien obsłużyć brak wsparcia dla geolokalizacji', async () => {
      (global as any).navigator = {};

      await expect(GeolocationService.getCurrentPosition())
        .rejects
        .toThrow('Geolokalizacja nie jest wspierana przez przeglądarkę');
    });

    it('powinien obsłużyć błędy geolokalizacji', async () => {
      const mockError = {
        code: 1,
        message: 'User denied geolocation'
      };

      mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => 
        error(mockError)
      );

      await expect(GeolocationService.getCurrentPosition())
        .rejects
        .toThrow('Błąd geolokalizacji: Użytkownik odmówił dostępu do geolokalizacji');
    });

    it('powinien użyć domyślnej lokalizacji gdy reverse geocoding się nie powiedzie', async () => {
      const mockPosition = {
        coords: {
          latitude: 52.2297,
          longitude: 21.0122,
          altitude: null
        }
      };

      mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => 
        success(mockPosition)
      );

      mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

      const result = await GeolocationService.getCurrentPosition();

      expect(result).toEqual({
        latitude: 52.2297,
        longitude: 21.0122,
        altitude: 0,
        displayName: env.VITE_DEFAULT_LOCATION
      });
    });
  });
});
