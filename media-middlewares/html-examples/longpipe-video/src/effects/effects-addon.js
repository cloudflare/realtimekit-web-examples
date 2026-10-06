import { EffectsDialog } from './effects-dialog.js';
import { LongpipeEffects } from './longpipe-effects.js';
import { EFFECTS_ICON } from './icons.js';

export const DEFAULT_BACKGROUNDS = Array.from(
  { length: 7 },
  (_, i) => `https://rtk-assets.realtime.cloudflare.com/backgrounds/bg_${i + 1}.jpg`
);

/**
 * UI Kit addon that adds an "Effects" button (setup screen, control bar and more menus)
 * which opens a background picker powered by Longpipe.
 *
 * Based on the video-background addon from @cloudflare/realtimekit-ui-addons.
 */
export class EffectsAddon {
  #effects;
  #dialog;
  #blurStrength;
  #label;
  #onChange;

  /**
   * @param {object} options
   * @param {object} options.meeting RealtimeKit meeting
   * @param {string[]} [options.images] Background image URLs (must allow CORS)
   * @param {number} [options.blurStrength] Blur strength from 0 to 1
   * @param {string} [options.label] Button label
   * @param {(effect: { mode: 'none' | 'blur' | 'image', url?: string }) => void} [options.onChange]
   */
  constructor({ meeting, images = DEFAULT_BACKGROUNDS, blurStrength = 0.5, label = 'Effects', onChange }) {
    this.#effects = new LongpipeEffects(meeting);
    this.#blurStrength = blurStrength;
    this.#label = label;
    this.#onChange = onChange;

    if (!customElements.get('rtk-effects-dialog')) {
      customElements.define('rtk-effects-dialog', EffectsDialog);
    }
    this.#dialog = document.createElement('rtk-effects-dialog');
    this.#dialog.images = images;
    this.#dialog.addEventListener('effect-select', (event) => this.#apply(event.detail));
    document.body.append(this.#dialog);
  }

  async #apply(effect) {
    this.#dialog.busy = true;
    try {
      if (effect.mode === 'none') {
        await this.#effects.clearBackground();
      } else if (effect.mode === 'blur') {
        await this.#effects.setBackground({ blur: { strength: this.#blurStrength } });
      } else {
        await this.#effects.setBackground(effect.url);
      }
      this.#dialog.selected = effect;
      this.#onChange?.(effect);
    } catch (error) {
      console.error('Failed to apply video effect', error);
    } finally {
      this.#dialog.busy = false;
    }
  }

  /** Called by `registerAddons` to add the Effects button to the UI Kit config */
  register(config, _meeting, getBuilder) {
    if (!LongpipeEffects.isSupported()) return config;

    const builder = getBuilder(config);
    const addButton = (target, props = {}) =>
      target?.add('rtk-controlbar-button', {
        id: 'effects',
        label: this.#label,
        icon: EFFECTS_ICON,
        onClick: () => this.#dialog.toggle(),
        ...props,
      });

    addButton(builder.find('div#setupcontrols-media'), { size: 'sm' });
    addButton(builder.find('div#controlbar-center'));
    for (const size of ['md', 'sm']) {
      addButton(builder.find('rtk-more-toggle', { activeMoreMenu: true, [size]: true }), {
        variant: 'horizontal',
        slot: 'more-elements',
      });
    }

    return builder.build();
  }
}
