# Dokumentacja Techniczna Horos

## Spis treści
1. [Implementacja obliczeń astrologicznych](#implementacja-obliczeń-astrologicznych)
2. [Integracja z LLM](#integracja-z-llm)
3. [System cache'owania](#system-cacheowania)
4. [Implementacja płatności](#implementacja-płatności)
5. [Bezpieczeństwo](#bezpieczeństwo)

## Implementacja obliczeń astrologicznych

### Swiss Ephemeris
Biblioteka Swiss Ephemeris jest wykorzystywana do precyzyjnych obliczeń pozycji planet. Główna implementacja znajduje się w `src/services/ephemeris.ts`:

```typescript
// Przykład implementacji kalkulacji pozycji planet
export class EphemerisService {
  calculatePlanetPositions(date: Date, latitude: number, longitude: number): PlanetPositions {
    // Implementacja obliczeń
    return {
      sun: { sign: "Aries", degree: 15.5, house: 1 },
      moon: { sign: "Taurus", degree: 23.4, house: 2 },
      // ...pozostałe planety
    };
  }
}
```

### Geolokalizacja
Serwis geolokalizacji (`src/services/geolocation.ts`) odpowiada za konwersję nazw miejsc na współrzędne geograficzne:

```typescript
export class GeolocationService {
  async getCoordinates(location: string): Promise<Coordinates> {
    // Implementacja geokodowania
    return {
      latitude: 52.2297,
      longitude: 21.0122
    };
  }
}
```

## Integracja z LLM

### Format danych
Dane astrologiczne są przekazywane do LLM w ustandaryzowanym formacie JSON:

```typescript
interface LLMRequest {
  planetPositions: PlanetPositions;
  aspects: AspectData[];
  houses: HouseData;
}
```

### Prompt Engineering
Przykładowy prompt dla LLM:

```typescript
const generatePrompt = (data: LLMRequest): string => `
Wygeneruj interpretację horoskopu na podstawie następujących danych astrologicznych:
- Słońce w ${data.planetPositions.sun.sign} (${data.planetPositions.sun.degree}°)
- Księżyc w ${data.planetPositions.moon.sign} (${data.planetPositions.moon.degree}°)
[...]
Limit odpowiedzi: 8000 tokenów.
`;
```

## System cache'owania

### Struktura cache'u
Cache przechowuje wygenerowane horoskopy w formacie JSON:

```typescript
interface CacheEntry {
  id: string;
  data: HoroscopeData;
  createdAt: Date;
  expiresAt: Date;
}
```

### Implementacja
Początkowo używamy systemu plików, docelowo SQLite:

```typescript
export class CacheService {
  async get(id: string): Promise<CacheEntry | null> {
    // Implementacja pobierania z cache
  }

  async set(entry: CacheEntry): Promise<void> {
    // Implementacja zapisywania do cache
  }
}
```

## Implementacja płatności

### Tpay
Integracja z systemem Tpay:

```typescript
export class TpayService {
  async createPayment(amount: number): Promise<PaymentSession> {
    // Implementacja tworzenia sesji płatności
    return {
      sessionId: "xxx",
      redirectUrl: "https://secure.tpay.com/..."
    };
  }
}
```

### BitPay
Integracja z systemem BitPay:

```typescript
export class BitPayService {
  async createInvoice(amount: number): Promise<BitPayInvoice> {
    // Implementacja tworzenia faktury
    return {
      id: "xxx",
      paymentUrl: "https://bitpay.com/..."
    };
  }
}
```

## Bezpieczeństwo

### Walidacja danych wejściowych
Wszystkie dane wejściowe są walidowane przy użyciu TypeScript i dodatkowych walidatorów:

```typescript
export const validateBirthData = (data: BirthData): ValidationResult => {
  // Implementacja walidacji
  return {
    isValid: true,
    errors: []
  };
};
```

### Zabezpieczenie API
- Używamy API key do autoryzacji żądań
- Rate limiting dla zapobiegania nadużyciom
- Sanityzacja danych wejściowych
- Szyfrowanie danych wrażliwych

### Obsługa błędów
Centralna obsługa błędów w middleware:

```typescript
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Implementacja obsługi błędów
  res.status(err.status || 500).json({
    code: err.code,
    message: err.message
  });
};
```

## Dobre praktyki

### Testowanie
- Testy jednostkowe dla kluczowych komponentów
- Testy integracyjne dla API
- Testy E2E dla krytycznych ścieżek

### Logowanie
- Używamy Winston do logowania
- Strukturyzowane logi w formacie JSON
- Różne poziomy logowania (debug, info, error)

### Monitorowanie
- Prometheus do zbierania metryk
- Grafana do wizualizacji
- Alerty dla krytycznych zdarzeń

## Rozwój projektu

### Migracja do SQLite
Plan migracji z systemu plików do SQLite:

1. Utworzenie schematu bazy danych
2. Implementacja migracji danych
3. Testy wydajności
4. Wdrożenie produkcyjne

### Skalowanie
- Implementacja cache'owania w Redis
- Load balancing
- Optymalizacja zapytań do bazy danych
