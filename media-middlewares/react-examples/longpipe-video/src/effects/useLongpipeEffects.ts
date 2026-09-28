import { useCallback, useEffect, useState } from 'react';
import type RealtimeKitClient from '@cloudflare/realtimekit';
import { LongpipeEffects } from './longpipe-effects';

export type Effect = { mode: 'none' } | { mode: 'blur' } | { mode: 'image'; url: string };

/**
 * Creates a `LongpipeEffects` instance for the meeting and tracks the selected effect.
 * @param blurStrength Blur strength from 0 to 1
 */
export function useLongpipeEffects(meeting: RealtimeKitClient | undefined, blurStrength = 0.5) {
  const [effects, setEffects] = useState<LongpipeEffects>();
  const [selected, setSelected] = useState<Effect>({ mode: 'none' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (meeting) setEffects(new LongpipeEffects(meeting));
  }, [meeting]);

  const apply = useCallback(
    async (effect: Effect) => {
      if (!effects || busy) return;
      setBusy(true);
      try {
        if (effect.mode === 'none') {
          await effects.clearBackground();
        } else if (effect.mode === 'blur') {
          await effects.setBackground({ blur: { strength: blurStrength } });
        } else {
          await effects.setBackground(effect.url);
        }
        setSelected(effect);
      } catch (error) {
        console.error('Failed to apply video effect', error);
      } finally {
        setBusy(false);
      }
    },
    [effects, busy, blurStrength]
  );

  return { selected, busy, apply };
}
