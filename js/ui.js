// Creazione dell'interfaccia e aggiornamento di quello che si vede a schermo

import { STEPS } from './counter.js';

const numberFormat = new Intl.NumberFormat('it-IT');

// elementi che devo ritrovare dopo averli creati
const refs = {
  root: null,
  value: null,
  minus: null,
  plus: null,
  stepButtons: [],
};

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createButton(className, text, onClick) {
  const button = createElement('button', className, text);
  button.type = 'button';
  button.addEventListener('click', onClick);
  return button;
}

function createControls(handlers) {
  const controls = createElement('div', 'counter__controls');

  refs.minus = createButton('counter__btn', '−', handlers.onDecrement);
  refs.plus = createButton('counter__btn', '+', handlers.onIncrement);

  controls.append(refs.minus, refs.plus);
  return controls;
}

function createStepSelector(handlers) {
  const group = createElement('div', 'step');
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Passo');

  const label = createElement('span', 'step__label', 'Passo');
  const list = createElement('div', 'step__list');

  refs.stepButtons = STEPS.map((step) => {
    const onClick = () => handlers.onStepChange(step);
    const button = createButton('step__btn', String(step), onClick);
    button.dataset.step = step;
    return button;
  });

  list.append(...refs.stepButtons);
  group.append(label, list);
  return group;
}

export function buildInterface(root, handlers) {
  refs.root = root;
  root.classList.add('counter');

  const title = createElement('h1', 'counter__title', 'Counter');

  // <output> viene letto dagli screen reader ogni volta che il valore cambia
  refs.value = createElement('output', 'counter__value');

  const options = createElement('div', 'counter__options');
  const resetButton = createButton('counter__reset', 'Azzera', handlers.onReset);
  options.append(createStepSelector(handlers), resetButton);

  const hint = createElement(
    'p',
    'counter__hint',
    'Da tastiera: frecce su e giù oppure + e −. Con 0 azzeri.'
  );

  root.append(title, refs.value, createControls(handlers), options, hint);
}

function formatValue(value) {
  const text = numberFormat.format(Math.abs(value));
  return value < 0 ? `−${text}` : text;
}

function getSign(value) {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'zero';
}

function playAnimation(direction) {
  const element = refs.value;
  element.classList.remove('is-up', 'is-down');
  if (!direction) return;

  // leggere offsetWidth forza il reflow, altrimenti sui click veloci
  // l'animazione non riparte
  void element.offsetWidth;
  element.classList.add(`is-${direction}`);
}

export function renderValue(value, direction) {
  const text = formatValue(value);

  refs.value.textContent = text;
  // il CSS usa il numero di caratteri per rimpicciolire il font
  refs.value.style.setProperty('--chars', text.length);
  refs.root.dataset.sign = getSign(value);

  playAnimation(direction);
}

export function renderStep(step) {
  refs.stepButtons.forEach((button) => {
    const isActive = Number(button.dataset.step) === step;
    button.setAttribute('aria-pressed', String(isActive));
  });

  refs.minus.setAttribute('aria-label', `Diminuisci di ${step}`);
  refs.plus.setAttribute('aria-label', `Aumenta di ${step}`);
}
