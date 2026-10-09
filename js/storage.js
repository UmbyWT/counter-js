// Salvataggio dello stato nel localStorage del browser

const STORAGE_KEY = 'counter-state';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // localStorage bloccato oppure dato rovinato: si riparte da zero
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // può fallire in navigazione privata, il counter funziona comunque
  }
}
