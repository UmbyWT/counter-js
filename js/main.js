import * as counter from './counter.js';
import { loadState, saveState } from './storage.js';
import { buildInterface, renderValue, renderStep } from './ui.js';

// Ogni azione fa lo stesso giro: cambio lo stato, lo salvo, aggiorno la pagina
function update(action, direction) {
  action();

  const state = counter.getState();
  saveState(state);
  renderValue(state.value, direction);
  renderStep(state.step);
}

const handlers = {
  onIncrement: () => update(counter.increment, 'up'),
  onDecrement: () => update(counter.decrement, 'down'),
  onReset: () => update(counter.reset),
  onStepChange: (step) => update(() => counter.setStep(step)),
};

const SHORTCUTS = {
  ArrowUp: handlers.onIncrement,
  '+': handlers.onIncrement,
  ArrowDown: handlers.onDecrement,
  '-': handlers.onDecrement,
  0: handlers.onReset,
};

function handleKeydown(event) {
  // lascio stare le scorciatoie del browser, tipo Ctrl + per lo zoom
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const shortcut = SHORTCUTS[event.key];
  if (!shortcut) return;

  event.preventDefault();
  shortcut();
}

function init() {
  counter.restore(loadState());
  buildInterface(document.querySelector('#app'), handlers);

  const { value, step } = counter.getState();
  renderValue(value);
  renderStep(step);

  document.addEventListener('keydown', handleKeydown);
}

init();
