# Horos - Aplikacja do Generowania Horoskopów

## Spis treści
- [Opis projektu](#opis-projektu)
- [Architektura](#architektura)
- [Technologie](#technologie)
- [Wymagania systemowe](#wymagania-systemowe)
- [Instalacja](#instalacja)
- [Struktura projektu](#struktura-projektu)
- [API](#api)
- [Rozwój projektu](#rozwój-projektu)
- [Testowanie](#testowanie)
- [Wdrożenie](#wdrożenie)

## Opis projektu
Horos to aplikacja internetowa służąca do generowania spersonalizowanych horoskopów na podstawie danych astrologicznych użytkownika. Wykorzystuje bibliotekę Swiss Ephemeris do obliczeń astrologicznych oraz model językowy DeepSeek v3 do generowania interpretacji.

### Główne funkcjonalności
- Obliczanie pozycji planet na podstawie daty, godziny i miejsca urodzenia
- Generowanie spersonalizowanych interpretacji horoskopów
- Interaktywny wykres urodzeniowy (Natal Chart)
- Przechowywanie i cache'owanie wygenerowanych interpretacji
- Integracja z systemami płatności (Tpay i BitPay)

## Architektura

### Frontend (React.js + TypeScript)
- Single Page Application (SPA)
- Komponenty React dla interfejsu użytkownika
- Chart.js do wizualizacji wykresów
- React Hook Form do zarządzania formularzami

### Backend (Node.js + Express)
- REST API dla komunikacji z frontendem
- Integracja z Swiss Ephemeris
- Komunikacja z modelem językowym (DeepSeek v3)
- System cache'owania wyników

### Przepływ danych
1. Użytkownik wprowadza dane w interfejsie
2. Frontend wysyła żądanie do backendu
3. Backend oblicza pozycje planet (Swiss Ephemeris)
4. Dane są przekazywane do LLM
5. Wygenerowana interpretacja jest zwracana do użytkownika

## Technologie

### Frontend
- React.js + TypeScript
- Chart.js do wykresów
- React Hook Form
- ESLint + Prettier

### Backend
- Node.js + Express
- Swiss Ephemeris
- OpenRouter API (LLM)
- SQLite (docelowo)

### Narzędzia deweloperskie
- Git + GitHub
- Jest + React Testing Library
- ESLint + Prettier
- Vite (bundler)

## Wymagania systemowe
- Node.js >= 18.x
- npm >= 9.x
- Dostęp do API OpenRouter
- Klucze API dla systemów płatności

## Instalacja

```bash
# Klonowanie repozytorium
git clone https://github.com/twoj-username/horos.git

# Instalacja zależności
cd horos
npm install

# Konfiguracja zmiennych środowiskowych
cp .env.example .env
# Uzupełnij .env odpowiednimi kluczami API

# Uruchomienie w trybie deweloperskim
npm run dev
```

## Struktura projektu

```
horos/
├── src/                    # Kod źródłowy frontendu
│   ├── components/         # Komponenty React
│   ├── services/          # Usługi (geolocation, ephemeris)
│   ├── store/             # Stan aplikacji (Redux)
│   ├── tests/             # Testy
│   └── types/             # Definicje TypeScript
├── server/                # Backend
│   ├── routes/           # Endpointy API
│   ├── middleware/       # Middleware Express
│   └── utils/            # Narzędzia pomocnicze
├── public/               # Statyczne zasoby
└── design/               # Dokumentacja architektury
```

## API

### Endpointy

#### POST /api/horoscope
Generuje horoskop na podstawie danych użytkownika.

```typescript
interface HoroscopeRequest {
  date: string;          // Format: YYYY-MM-DD
  time: string;          // Format: HH:MM
  latitude: number;
  longitude: number;
}

interface HoroscopeResponse {
  interpretation: string;
  chart: ChartData;
  planets: PlanetPositions;
}
```

#### GET /api/cached-horoscope/:id
Pobiera zapisany horoskop z cache'u.

## Rozwój projektu

### Konwencje kodowania
- Używaj TypeScript dla wszystkich nowych plików
- Formatuj kod używając Prettier
- Przestrzegaj zasad ESLint
- Pisz testy dla nowych funkcjonalności

### Gałęzie Git
- `main` - kod produkcyjny
- `develop` - gałąź rozwojowa
- `feature/*` - nowe funkcjonalności
- `bugfix/*` - poprawki błędów

## Testowanie

```bash
# Uruchomienie testów jednostkowych
npm run test

# Uruchomienie testów z pokryciem
npm run test:coverage

# Testy E2E
npm run test:e2e
```

## Wdrożenie

### Frontend (Vercel)
- Automatyczne wdrożenia z gałęzi `main`
- Podgląd dla pull requestów

### Backend (Render)
- Automatyczne wdrożenia z gałęzi `main`
- Skalowanie na podstawie obciążenia

### Zmienne środowiskowe
Wymagane zmienne środowiskowe:
- `OPENROUTER_API_KEY` - klucz do API OpenRouter
- `TPAY_API_KEY` - klucz do API TPay
- `BITPAY_API_KEY` - klucz do API BitPay
- `DATABASE_URL` - URL do bazy danych (dla SQLite)

## Licencja
Projekt jest własnością prywatną. Wszelkie prawa zastrzeżone.
