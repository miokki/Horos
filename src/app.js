// Import wymaganych bibliotek
import { calculate } from 'swisseph';
import dotenv from 'dotenv';

// Ładowanie konfiguracji środowiska
dotenv.config();

// Sprawdzenie obecności klucza API
if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('Brak klucza API OpenRouter w konfiguracji środowiska');
}

// Funkcja główna inicjalizująca aplikację
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('astroForm');
    const resultsDiv = document.getElementById('results');

    // Obsługa wysłania formularza
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Pobranie danych z formularza
        const birthDate = document.getElementById('birthDate').value;
        const birthTime = document.getElementById('birthTime').value;
        const location = document.getElementById('location').value;

        try {
            // Konwersja daty i czasu na format juliański
            const dateTime = new Date(`${birthDate}T${birthTime}`);
            const julianDay = calculate.julianDay(dateTime);

            // Obliczenie pozycji planet
            const planetaryData = calculate.planetaryPositions(julianDay);

            // Transformacja danych do formatu JSON
            const jsonData = transformToJSON(planetaryData);

            // Wysłanie danych do OpenRouter API
            const interpretation = await sendToOpenRouter(jsonData);

            // Wyświetlenie wyników
            displayResults(interpretation);
        } catch (error) {
            console.error('Błąd podczas obliczeń:', error);
            resultsDiv.innerHTML = `<p class="error">Wystąpił błąd: ${error.message}</p>`;
        }
    });
});

// Funkcja transformująca dane do formatu JSON
function transformToJSON(planetaryData) {
    return {
        date: planetaryData.date,
        positions: planetaryData.planets.map(planet => ({
            name: planet.name,
            longitude: planet.longitude,
            latitude: planet.latitude,
            house: planet.house
        }))
    };
}

// Funkcja wysyłająca dane do OpenRouter API
async function sendToOpenRouter(jsonData) {
    const response = await fetch('https://openrouter.ai/api/v1/interpret', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify(jsonData)
    });

    if (!response.ok) {
        throw new Error('Błąd podczas komunikacji z OpenRouter API');
    }

    return await response.json();
}

// Funkcja wyświetlająca wyniki
function displayResults(interpretation) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="interpretation">
            <h3>Interpretacja:</h3>
            <p>${interpretation.text}</p>
        </div>
    `;
}
