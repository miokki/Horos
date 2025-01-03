# Wymagania Projektu: Horos

## 1. Wprowadzenie

Celem projektu jest stworzenie aplikacji internetowej o nazwie "Horos", która będzie generować spersonalizowane horoskopy na podstawie danych astrologicznych użytkownika. Aplikacja będzie korzystać z modelu językowego (LLM), najprawdopodobniej DeepSeek v3, do generowania interpretacji horoskopów, a także z biblioteki Swiss Ephemeris do obliczeń astrologicznych.

## 2. Funkcjonalności

### 2.1. Podstawowe funkcjonalności

*   **Obliczanie pozycji planet:**
    *   Aplikacja musi umożliwiać użytkownikowi wprowadzenie daty, godziny i miejsca urodzenia.
    *   Na podstawie tych danych, aplikacja ma obliczać pozycje planet w momencie urodzenia użytkownika, wykorzystując bibliotekę Swiss Ephemeris.
*   **Generowanie horoskopu:**
    *   Aplikacja będzie wysyłać obliczone dane astrologiczne (pozycje planet) do LLM (np. DeepSeek v3) w formacie JSON.
    *   LLM wygeneruje spersonalizowaną interpretację horoskopu na podstawie otrzymanych danych.
    *   Wygenerowana interpretacja powinna być wyświetlana użytkownikowi w przystępnej formie.
    *   Limit tokenów dla interpretacji to 8000.
*   **Wyświetlanie horoskopu:**
    *   Horoskop powinien być wyświetlany w czytelny i estetyczny sposób, z podziałem na sekcje (np. Słońce w Znaku X, Księżyc w Znaku Y, itd.).
*   **Przechowywanie interpretacji:**
    *   Wygenerowane interpretacje powinny być przechowywane, aby uniknąć ponownego generowania dla tych samych danych. Wstępnie wystarczy proste rozwiązanie oparte na plikach, z opcją późniejszego przejścia na lekką bazę danych.

### 2.2. Dodatkowe funkcjonalności

*   **Wykres urodzeniowy (Natal Chart):**
    *   Aplikacja powinna generować i wyświetlać graficzny wykres urodzeniowy użytkownika, pokazujący pozycje planet w domach i znakach zodiaku.
    *   Wykres powinien być estetyczny i czytelny, z możliwością interakcji (np. najechanie kursorem na planetę, aby zobaczyć jej opis).
*   **Animacje planet:**
    *   Rozważ dodanie animacji planet na wykresie urodzeniowym lub w osobnym widoku, aby uatrakcyjnić wizualnie aplikację.
*   **Interaktywne koło zodiaku:**
    *   Dodaj interaktywne koło zodiaku, pozwalające użytkownikowi na eksplorację znaków zodiaku i ich cech.

## 3. Interfejs Użytkownika (UI)

*   **Styl:** Nowoczesny, minimalistyczny design.
*   **Strona główna:**
    *   Formularz do wprowadzania danych urodzeniowych (data, godzina, lokalizacja).
    *   Przycisk do generowania horoskopu.
    *   Ewentualnie: krótkie wprowadzenie do aplikacji i astrologii.
*   **Strona z horoskopem:**
    *   Wyświetlenie wygenerowanego horoskopu.
    *   Wykres urodzeniowy (opcjonalnie).
    *   Przyciski nawigacyjne (np. powrót do strony głównej).
*   **Responsywność:** Aplikacja powinna być responsywna i działać poprawnie na różnych urządzeniach (komputery, tablety, smartfony).

## 4. Technologie

*   **Język programowania:** Do ustalenia przez DeepSeek v3, priorytet dla języków dobrze współpracujących z LLM i bibliotekami do obliczeń astrologicznych.
*   **Frontend:** Do ustalenia przez DeepSeek v3, z uwzględnieniem łatwości tworzenia interaktywnych elementów i wizualizacji.
*   **Biblioteka astrologiczna:** Swiss Ephemeris (lub jej odpowiednik/wrapper w wybranym języku programowania).
*   **Model językowy:** DeepSeek v3 (lub inny odpowiedni model LLM).
*   **Baza danych:** Na początku proste rozwiązanie oparte na plikach, później ewentualnie lekka baza danych (np. SQLite).
*   **Hosting:** Prosta platforma do hostingu statycznych stron (np. Netlify, GitHub Pages, Vercel).

## 5. Integracja z LLM

*   **Format danych:** Dane astrologiczne (pozycje planet) będą wysyłane do LLM w formacie JSON. Przykładowa struktura:
    ```json
    {
        "date": "YYYY-MM-DD",
        "time": "HH:MM",
        "latitude": "XX.XXXX",
        "longitude": "YY.YYYY",
        "planets": {
            "Sun": { "sign": "Aries", "degree": "XX.XX", "house": "X" },
            "Moon": { "sign": "Taurus", "degree": "XX.XX", "house": "Y" },
            // ... pozostałe planety ...
        }
    }
    ```
*   **Prompt dla LLM:** Należy opracować prompt, który precyzyjnie instruuje LLM, jak generować interpretację horoskopu na podstawie danych astrologicznych. Przykładowy fragment promptu: "Wygeneruj spersonalizowany horoskop na podstawie poniższych danych astrologicznych. Użytkownik urodził się... Słońce znajdowało się w znaku... Księżyc w znaku..."
*   **Limit tokenów:** Należy upewnić się, że wygenerowana interpretacja nie przekracza limitu 8000 tokenów.

## 6. Płatności

*   **Integracja z bramkami płatności:** Tpay i BitPay.
*   **Model płatności:** Do ustalenia (np. jednorazowa opłata za wygenerowanie horoskopu, subskrypcja z dostępem do dodatkowych funkcji).

## 7. Internacjonalizacja

*   **Priorytet:** Wersja polska.
*   **Przyszłe języki:** Do ustalenia.
*   **Mechanizm:** Wykorzystanie plików językowych i potencjalnie narzędzi do tłumaczenia (w tym DeepSeek v3) do przetłumaczenia interfejsu.

## 8. Testowanie

*   Aplikacja powinna być dokładnie przetestowana pod kątem funkcjonalności, poprawności obliczeń astrologicznych, responsywności i działania na różnych przeglądarkach.

## 9. Narzędzia

*   **Cline:** Do zarządzania projektem i komunikacji z DeepSeek v3.
*   **Git:** Do kontroli wersji kodu.
*   **Chmura (Dysk Google, Dropbox, GitHub):** Do przechowywania dokumentacji i kodu.

## 10. Uwagi Końcowe

*   Dokument ten stanowi wstępny zarys wymagań i może być uzupełniany i modyfikowany w trakcie prac nad projektem.
*   Wszelkie decyzje dotyczące wyboru technologii, architektury i szczegółów implementacji będą podejmowane we współpracy z DeepSeek v3, działającym jako Senior Full-Stack Developer.
*   Należy położyć nacisk na prostotę i efektywność zarówno w architekturze aplikacji, jak i w procesie jej tworzenia.
*   Projekt powinien być rozwijany przyrostowo, zaczynając od podstawowych funkcjonalności i stopniowo dodając kolejne.
