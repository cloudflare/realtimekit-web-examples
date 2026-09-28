import type { Addon, RtkUiBuilder, UIConfig } from '@cloudflare/realtimekit-react-ui';
import { LongpipeEffects } from './longpipe-effects';
import { EFFECTS_ICON } from './icons';

interface EffectsAddonOptions {
  /** Called when the Effects button is clicked */
  onClick: () => void;
  label?: string;
}

/**
 * UI Kit addon that adds an "Effects" button to the setup screen, the control bar and the
 * "more" menus. The picker itself is rendered by React (see `EffectsDialog`).
 */
export class EffectsAddon implements Addon {
  #onClick: () => void;
  #label: string;

  constructor({ onClick, label = 'Effects' }: EffectsAddonOptions) {
    this.#onClick = onClick;
    this.#label = label;
  }

  register(config: UIConfig, _meeting: unknown, getBuilder: (config: UIConfig) => RtkUiBuilder) {
    if (!LongpipeEffects.isSupported()) return config;

    const builder = getBuilder(config);
    const addButton = (target: ReturnType<RtkUiBuilder['find']>, props: Record<string, string> = {}) =>
      target?.add('rtk-controlbar-button', {
        id: 'effects',
        label: this.#label,
        icon: EFFECTS_ICON,
        // The builder types props as strings, but event handler props are passed through as-is
        onClick: this.#onClick as unknown as string,
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

  unregister() {}
}
