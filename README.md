# Horos - System Zarządzania Projektami

## Opis Projektu
Horos to nowoczesna aplikacja webowa do zarządzania projektami, stworzona z myślą o efektywnej współpracy zespołów. System oferuje kompleksowe narzędzia do planowania, śledzenia postępów i zarządzania zasobami.

## Wymagania Techniczne
- Node.js v18+
- MongoDB 6.0+
- Redis 7.0+
- Docker 20.10+

## Architektura Systemu
System oparty jest na architekturze mikroserwisowej, z następującymi głównymi komponentami:
- API Gateway
- Serwis Użytkowników
- Serwis Projektów
- Serwis Zadaniowy
- Serwis Notyfikacji

## Schematy Danych
Główne modele danych:
- Użytkownik (User)
- Projekt (Project)
- Zadanie (Task)
- Komentarz (Comment)
- Załącznik (Attachment)

## Roadmapa
1. Faza 1: Implementacja podstawowych funkcjonalności (Q1 2024)
2. Faza 2: Integracja z zewnętrznymi systemami (Q2 2024)
3. Faza 3: Optymalizacja wydajności (Q3 2024)
4. Faza 4: Wdrożenie produkcyjne (Q4 2024)

## Instalacja i Uruchomienie

1. Sklonuj repozytorium:
```bash
git clone https://github.com/example/horos.git
cd horos
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skonfiguruj zmienne środowiskowe:
```bash
cp .env.example .env
```

4. Uruchom serwer deweloperski:
```bash
npm run dev
```

## Zależności
Główne zależności projektu:
- Express.js
- Mongoose
- Socket.IO
- React
- Redux
- Jest

## Licencja
Projekt objęty jest licencją MIT. Szczegóły w pliku LICENSE.

## Autorzy
- Jan Kowalski (Lead Developer)
- Anna Nowak (UI/UX Designer)
- Piotr Wiśniewski (DevOps Engineer)
