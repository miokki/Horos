import '@testing-library/jest-dom';

// Mock dla geolokalizacji przeglądarki
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn()
};

(global as any).navigator.geolocation = mockGeolocation;

// Mock dla localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock dla service worker
Object.defineProperty(window, 'navigator', {
  value: {
    ...window.navigator,
    serviceWorker: {
      register: jest.fn().mockImplementation(() => Promise.resolve()),
      ready: Promise.resolve({
        active: {
          postMessage: jest.fn()
        }
      })
    }
  },
  writable: true
});

// Wyciszenie ostrzeżeń konsoli podczas testów
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Czyszczenie wszystkich mocków po każdym teście
afterEach(() => {
  jest.clearAllMocks();
});
