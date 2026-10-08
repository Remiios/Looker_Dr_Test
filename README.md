# Instrukcja wdrożenia na GitHub (Wersja Uproszczona - BEZ Node.js)

Ta wersja nie wymaga instalacji Node.js, Webpacka ani budowania projektu (folderu build). 
Wszystkie potrzebne biblioteki pobierają się automatycznie po otwarciu wykresu w przeglądarce.

## Krok 1: Publikacja na GitHub Pages
1. Utwórz **nowe, publiczne repozytorium** na GitHubie (np. `looker-animacja`).
2. Prześlij bezpośrednio do niego 4 pliki:
   - `manifest.json`
   - `index.json`
   - `index.js`
   - `index.css`
3. Wejdź w zakładkę **Settings** (Ustawienia) repozytorium -> w menu po lewej wybierz **Pages**.
4. W sekcji "Source" (Pod "Build and deployment") wybierz gałąź **main** (lub master) i kliknij Save.
5. Zobaczysz powiadomienie z linkiem do Twojej strony (np. `https://<TWOJ_LOGIN>.github.io/<NAZWA_REPO>/`). Skopiuj go.

## Krok 2: Konfiguracja pliku manifest.json
1. Otwórz plik `manifest.json` na GitHubie (kliknij ikonkę ołówka, żeby go edytować).
2. Podmień frazę `<TWOJ_LOGIN>.github.io/<TWOJE_REPO>` w sekcji `"resource"` na Twój rzeczywisty link.
   - Pamiętaj, aby ścieżki wskazywały bezpośrednio na pliki (np. `https://janek.github.io/moje-repo/index.js`).
3. Zapisz zmiany (Commit changes).

## Krok 3: Dodanie do Looker Studio
1. Otwórz raport w Looker Studio.
2. Kliknij **ikonę 4 kwadracików** (Komponenty społecznościowe) w górnym menu.
3. Wybierz **Zbuduj własną wizualizację** (+ Explore more -> Build your own).
4. W pole **Manifest Path** wklej adres swojego pliku manifest (np. `https://<TWOJ_LOGIN>.github.io/<NAZWA_REPO>/manifest.json`).
5. Ułóż wykres na stronie.
