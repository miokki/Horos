import EphemerisService, { CelestialBodies } from '../../services/ephemeris';

describe('EphemerisService', () => {
  const testDate = new Date('2024-02-15T12:00:00Z');
  const testGeoPosition = {
    latitude: 52.2297,
    longitude: 21.0122,
    altitude: 0
  };

  beforeAll(() => {
    // Upewnij się, że serwis jest zainicjalizowany przed testami
    EphemerisService['initialized'] = true;
  });

  afterAll(() => {
    // Zamknij serwis po testach
    EphemerisService.close();
  });

  describe('calculateCelestialPosition', () => {
    it('powinien obliczyć pozycję Słońca', () => {
      const result = EphemerisService.calculateCelestialPosition(
        CelestialBodies.SUN,
        testDate
      );

      expect(result).toBeDefined();
      expect(typeof result.longitude).toBe('number');
      expect(typeof result.latitude).toBe('number');
      expect(typeof result.distance).toBe('number');
      expect(typeof result.longitudeSpeed).toBe('number');
      expect(typeof result.latitudeSpeed).toBe('number');
      expect(typeof result.distanceSpeed).toBe('number');
    });

    it('powinien obliczyć pozycję z uwzględnieniem lokalizacji', () => {
      const result = EphemerisService.calculateCelestialPosition(
        CelestialBodies.MOON,
        testDate,
        testGeoPosition
      );

      expect(result).toBeDefined();
      expect(typeof result.longitude).toBe('number');
      expect(typeof result.latitude).toBe('number');
      expect(typeof result.distance).toBe('number');
    });

    it('powinien rzucić błąd dla nieprawidłowych danych', () => {
      expect(() => {
        EphemerisService.calculateCelestialPosition(
          -1 as CelestialBodies,
          testDate
        );
      }).toThrow();
    });
  });
});
