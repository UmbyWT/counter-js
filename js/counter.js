// Stato del counter e funzioni che lo modificano.
// Questo file non tocca mai il DOM.

export const STEPS = [1, 5, 10];

const state = {
  value: 0,
  step: STEPS[0],
};

// restituisco una copia: da fuori lo stato si cambia solo
// con le funzioni qui sotto
export function getState() {
  return { ...state };
}

export function increment() {
  state.value += state.step;
}

export function decrement() {
  state.value -= state.step;
}

export function reset() {
  state.value = 0;
}

export function setStep(step) {
  if (STEPS.includes(step)) {
    state.step = step;
  }
}

// usata all'avvio per ripartire dai dati salvati
export function restore(saved) {
  if (!saved) return;

  if (Number.isSafeInteger(saved.value)) {
    state.value = saved.value;
  }
  setStep(saved.step);
}
