import { registerSW } from 'virtual:pwa-register';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm('Dostępna jest nowa wersja aplikacji. Czy chcesz ją zainstalować?')) {
          updateSW();
        }
      },
      onOfflineReady() {
        console.log('Aplikacja jest gotowa do pracy offline');
      },
      onRegistered(registration) {
        console.log('Service Worker zarejestrowany:', registration);
      },
      onRegisterError(error) {
        console.error('Błąd rejestracji Service Worker:', error);
      }
    });
  }
}
