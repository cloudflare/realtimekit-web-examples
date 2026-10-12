import { BLUR_ICON, CLOSE_ICON, NONE_ICON } from './icons.js';

const STYLE = `
  :host {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: none;
    align-items: center;
    justify-content: center;
    font-family: var(--rtk-font-family, inherit);
    background-color: rgba(var(--rtk-colors-background-600, 60 60 60) / 0.5);
    backdrop-filter: blur(12px) saturate(180%);
  }
  :host([open]) {
    display: flex;
  }
  :host([busy]) .option {
    cursor: wait;
  }

  .dialog {
    position: relative;
    box-sizing: border-box;
    width: 34rem;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    background-color: rgb(var(--rtk-colors-background-900, 26 26 26));
    color: rgb(var(--rtk-colors-text-1000, 255 255 255));
  }

  header {
    margin-bottom: 0.5rem;
    font-size: 1.4rem;
    font-weight: bold;
  }

  .close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    display: flex;
    padding: 4px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
  .close:hover {
    background-color: rgb(var(--rtk-colors-background-600, 60 60 60));
  }
  .close svg {
    width: 16px;
    height: 16px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 100px);
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .option {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    padding: 0;
    overflow: hidden;
    border: 2px solid rgb(var(--rtk-colors-background-800, 26 26 26));
    border-radius: 8px;
    background-color: rgb(var(--rtk-colors-background-800, 26 26 26));
    color: rgb(var(--rtk-colors-text-900, 238 238 238));
    cursor: pointer;
  }
  .option:hover,
  .option.selected {
    border-color: rgb(var(--rtk-colors-brand-500, 33 96 253));
  }
  .option:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .option img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/**
 * `<rtk-effects-dialog>`: picker for "no effect", blur and background images.
 *
 * Dispatches `effect-select` with `{ mode: 'none' | 'blur' | 'image', url? }` when an
 * option is picked. Set `selected` to highlight the active effect and `busy` while it is
 * being applied.
 */
export class EffectsDialog extends HTMLElement {
  #images = [];
  #selected = { mode: 'none' };
  #busy = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.addEventListener('click', (event) => {
      // Clicks inside the shadow root are retargeted to the host, so check the real target
      if (event.composedPath()[0] === this) this.toggle(false); // backdrop click
    });
  }

  connectedCallback() {
    this.#render();
  }

  set images(images) {
    this.#images = images;
    this.#render();
  }

  set selected(effect) {
    this.#selected = effect;
    this.#updateHighlight();
  }

  set busy(busy) {
    this.#busy = busy;
    this.toggleAttribute('busy', busy);
  }

  toggle(open) {
    this.toggleAttribute('open', open);
  }

  #render() {
    const root = this.shadowRoot;
    root.innerHTML = `
      <style>${STYLE}</style>
      <div class="dialog" role="dialog" aria-label="Effects">
        <header>Effects</header>
        <button class="close" aria-label="Close">${CLOSE_ICON}</button>
        <div class="grid">
          <button class="option" data-mode="none" title="No effect">${NONE_ICON}</button>
          <button class="option" data-mode="blur" title="Blur">${BLUR_ICON}</button>
        </div>
        <div class="grid images"></div>
      </div>
    `;

    root.querySelector('.images').append(...this.#images.map((url) => this.#createImageOption(url)));

    root.querySelector('.close').addEventListener('click', () => this.toggle(false));
    root.querySelectorAll('.option').forEach((option) => {
      option.addEventListener('click', () => this.#select(option));
    });

    this.#updateHighlight();
  }

  #createImageOption(url) {
    const option = document.createElement('button');
    option.className = 'option';
    option.dataset.mode = 'image';
    option.dataset.url = url;
    option.title = 'Background image';

    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.alt = '';
    img.src = url;
    img.addEventListener('error', () => (option.disabled = true)); // e.g. missing CORS headers

    option.append(img);
    return option;
  }

  #select(option) {
    if (this.#busy) return;
    const { mode, url } = option.dataset;
    this.dispatchEvent(new CustomEvent('effect-select', { detail: url ? { mode, url } : { mode } }));
  }

  #updateHighlight() {
    const { mode, url } = this.#selected;
    this.shadowRoot.querySelectorAll('.option').forEach((option) => {
      const isSelected = option.dataset.mode === mode && (mode !== 'image' || option.dataset.url === url);
      option.classList.toggle('selected', isSelected);
    });
  }
}
