import * as swisseph from 'swisseph';
import * as fs from 'fs';
import * as path from 'path';
import { env } from '../config/env';

// Stałe dla ciał niebieskich
export enum CelestialBodies {
  SUN = swisseph.SE_SUN,
  MOON = swisseph.SE_MOON,
  MERCURY = swisseph.SE_MERCURY,
  VENUS = swisseph.SE_VENUS,
  MARS = swisseph.SE_MARS,
  JUPITER = swisseph.SE_JUPITER,
  SATURN = swisseph.SE_SATURN,
  URANUS = swisseph.SE_URANUS,
  NEPTUNE = swisseph.SE_NEPTUNE,
  PLUTO = swisseph.SE_PLUTO
}

interface EphemerisResult {
  longitude: number;
  latitude: number;
  distance: number;
  longitudeSpeed: number;
  latitudeSpeed: number;
  distanceSpeed: number;
}

interface GeoPosition {
  latitude: number;
  longitude: number;
  altitude: number;
}

// Rozszerzone typy dla różnych formatów wyników Swiss Ephemeris
type EclipticCoordinates = {
  longitude: number;
  latitude: number;
  distance: number;
  longitudeSpeed: number;
  latitudeSpeed: number;
  distanceSpeed: number;
  rflag: number;
};

type EquatorialCoordinates = {
  rectAscension: number;
  declination: number;
  distance: number;
  rectAscensionSpeed: number;
  declinationSpeed: number;
  distanceSpeed: number;
  rflag: number;
};

type CartesianCoordinates = {
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
  rflag: number;
};

type SwissEphResult = 
  | EclipticCoordinates 
  | EquatorialCoordinates 
  | CartesianCoordinates
  | { error: string };

class EphemerisService {
  private static instance: EphemerisService;
  private initialized: boolean = false;
  private ephePath: string;

  private constructor() {
    this.ephePath = env.VITE_EPHE_PATH;
    this.validateEphePath();
    this.init();
  }

  public static getInstance(): EphemerisService {
    if (!EphemerisService.instance) {
      EphemerisService.instance = new EphemerisService();
    }
    return EphemerisService.instance;
  }

  /**
   * Sprawdzenie czy katalog z plikami efemeryd istnieje i zawiera wymagane pliki
   */
  private validateEphePath(): void {
    if (!fs.existsSync(this.ephePath)) {
      throw new Error(`Katalog efemeryd nie istnieje: ${this.ephePath}`);
    }

    // Sprawdź czy istnieją podstawowe pliki efemeryd
    const requiredFiles = ['sepl_18.se1', 'semo_18.se1', 'seas_18.se1'];
    for (const file of requiredFiles) {
      const filePath = path.join(this.ephePath, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Brak wymaganego pliku efemerydy: ${filePath}`);
      }
    }
  }

  /**
   * Inicjalizacja Swiss Ephemeris
   */
  private init(): void {
    try {
      if (!this.initialized) {
        swisseph.swe_set_ephe_path(this.ephePath);
        // Sprawdź czy inicjalizacja się powiodła
        const testDate = new Date();
        const julianDay = this.dateToJulianDay(testDate);
        const testResult = swisseph.swe_calc_ut(julianDay, CelestialBodies.SUN, swisseph.SEFLG_SWIEPH);
        
        if ('error' in testResult) {
          throw new Error(`Błąd Swiss Ephemeris: ${testResult.error}`);
        }

        if ('rflag' in testResult && testResult.rflag < 0) {
          throw new Error('Nie udało się wykonać testowych obliczeń');
        }
        
        this.initialized = true;
      }
    } catch (error: any) {
      throw new Error(`Błąd inicjalizacji Swiss Ephemeris: ${error.message}`);
    }
  }

  /**
   * Konwersja daty na Julian Day
   */
  private dateToJulianDay(date: Date): number {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours() + 
                 date.getUTCMinutes() / 60 + 
                 date.getUTCSeconds() / 3600;

    return swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
  }

  /**
   * Walidacja ciała niebieskiego
   */
  private validateCelestialBody(body: CelestialBodies): void {
    const validBodies = Object.values(CelestialBodies).filter(x => typeof x === 'number');
    if (!validBodies.includes(body)) {
      throw new Error('Nieprawidłowe ciało niebieskie');
    }
  }

  /**
   * Walidacja pozycji geograficznej
   */
  private validateGeoPosition(geoPosition: GeoPosition): void {
    if (typeof geoPosition.latitude !== 'number' || 
        typeof geoPosition.longitude !== 'number' || 
        typeof geoPosition.altitude !== 'number') {
      throw new Error('Nieprawidłowe dane pozycji geograficznej');
    }

    if (geoPosition.latitude < -90 || geoPosition.latitude > 90) {
      throw new Error('Szerokość geograficzna musi być w zakresie -90 do 90 stopni');
    }

    if (geoPosition.longitude < -180 || geoPosition.longitude > 180) {
      throw new Error('Długość geograficzna musi być w zakresie -180 do 180 stopni');
    }
  }

  /**
   * Konwersja współrzędnych równikowych na ekliptyczne
   */
  private convertToEclipticCoordinates(result: EquatorialCoordinates): EphemerisResult {
    return {
      longitude: result.rectAscension,
      latitude: result.declination,
      distance: result.distance,
      longitudeSpeed: result.rectAscensionSpeed,
      latitudeSpeed: result.declinationSpeed,
      distanceSpeed: result.distanceSpeed
    };
  }

  /**
   * Konwersja współrzędnych kartezjańskich na ekliptyczne
   */
  private convertCartesianToEcliptic(result: CartesianCoordinates): EphemerisResult {
    // Konwersja z układu kartezjańskiego na sferyczny
    const r = Math.sqrt(result.x * result.x + result.y * result.y + result.z * result.z);
    const longitude = Math.atan2(result.y, result.x) * 180 / Math.PI;
    const latitude = Math.asin(result.z / r) * 180 / Math.PI;

    // Obliczenie prędkości
    const rSpeed = (result.x * result.dx + result.y * result.dy + result.z * result.dz) / r;
    const longitudeSpeed = (result.x * result.dy - result.y * result.dx) / (result.x * result.x + result.y * result.y) * 180 / Math.PI;
    const latitudeSpeed = (result.z * rSpeed - r * result.dz) / (r * r * Math.sqrt(1 - (result.z * result.z) / (r * r))) * 180 / Math.PI;

    return {
      longitude: longitude < 0 ? longitude + 360 : longitude,
      latitude,
      distance: r,
      longitudeSpeed,
      latitudeSpeed,
      distanceSpeed: rSpeed
    };
  }

  /**
   * Przetwarzanie wyników z Swiss Ephemeris
   */
  private processSwissEphResult(result: SwissEphResult): EphemerisResult {
    if ('error' in result) {
      throw new Error(`Błąd Swiss Ephemeris: ${result.error}`);
    }

    if (!result || typeof result !== 'object') {
      throw new Error('Nieprawidłowy wynik obliczeń');
    }

    // Sprawdź czy mamy współrzędne równikowe
    if ('rectAscension' in result) {
      return this.convertToEclipticCoordinates(result);
    }

    // Sprawdź czy mamy współrzędne kartezjańskie
    if ('x' in result) {
      return this.convertCartesianToEcliptic(result);
    }

    // Dla współrzędnych ekliptycznych
    if ('longitude' in result) {
      return {
        longitude: result.longitude,
        latitude: result.latitude,
        distance: result.distance,
        longitudeSpeed: result.longitudeSpeed || 0,
        latitudeSpeed: result.latitudeSpeed || 0,
        distanceSpeed: result.distanceSpeed || 0
      };
    }

    throw new Error('Nieobsługiwany format wyników');
  }

  /**
   * Obliczanie pozycji ciała niebieskiego
   */
  public calculateCelestialPosition(
    body: CelestialBodies,
    date: Date,
    geoPosition?: GeoPosition
  ): EphemerisResult {
    if (!this.initialized) {
      throw new Error('Serwis nie został zainicjalizowany');
    }

    try {
      this.validateCelestialBody(body);
      if (geoPosition) {
        this.validateGeoPosition(geoPosition);
      }

      const julianDay = this.dateToJulianDay(date);
      const flags = swisseph.SEFLG_SPEED | swisseph.SEFLG_SWIEPH;

      const result = swisseph.swe_calc_ut(
        julianDay,
        body,
        flags | (geoPosition ? swisseph.SEFLG_TOPOCTR : 0)
      );

      return this.processSwissEphResult(result);
    } catch (error: any) {
      if (error.message.includes('Nieprawidłowe')) {
        throw error;
      }
      throw new Error(`Błąd podczas obliczeń efemerydy: ${error.message}`);
    }
  }

  /**
   * Zamknięcie Swiss Ephemeris
   */
  public close(): void {
    if (this.initialized) {
      swisseph.swe_close();
      this.initialized = false;
    }
  }
}

export default EphemerisService.getInstance();
