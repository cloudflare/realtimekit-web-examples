import { useState } from 'react';
import type { Effect } from './useLongpipeEffects';
import { BLUR_ICON, CLOSE_ICON, NONE_ICON } from './icons';
import './EffectsDialog.css';

interface EffectsDialogProps {
  open: boolean;
  images: string[];
  selected: Effect;
  busy: boolean;
  onSelect: (effect: Effect) => void;
  onClose: () => void;
}

const isSelected = (selected: Effect, effect: Effect) =>
  selected.mode === effect.mode &&
  (effect.mode !== 'image' || (selected.mode === 'image' && selected.url === effect.url));

/** Picker for "no effect", blur and background images */
export function EffectsDialog({ open, images, selected, busy, onSelect, onClose }: EffectsDialogProps) {
  const [failedImages, setFailedImages] = useState<string[]>([]);

  if (!open) return null;

  const option = (effect: Effect, title: string, content: JSX.Element, disabled = false) => (
    <button
      key={effect.mode === 'image' ? effect.url : effect.mode}
      className={`effects-option${isSelected(selected, effect) ? ' selected' : ''}`}
      title={title}
      disabled={disabled}
      onClick={() => onSelect(effect)}
    >
      {content}
    </button>
  );

  return (
    <div className={`effects-backdrop${busy ? ' busy' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="effects-dialog" role="dialog" aria-label="Effects">
        <header>Effects</header>
        <button className="effects-close" aria-label="Close" onClick={onClose} dangerouslySetInnerHTML={{ __html: CLOSE_ICON }} />
        <div className="effects-grid">
          {option({ mode: 'none' }, 'No effect', <span dangerouslySetInnerHTML={{ __html: NONE_ICON }} />)}
          {option({ mode: 'blur' }, 'Blur', <span dangerouslySetInnerHTML={{ __html: BLUR_ICON }} />)}
        </div>
        <div className="effects-grid">
          {images.map((url) =>
            option(
              { mode: 'image', url },
              'Background image',
              // Images must allow CORS; options for images that fail to load are disabled
              <img src={url} alt="" crossOrigin="anonymous" onError={() => setFailedImages((urls) => [...urls, url])} />,
              failedImages.includes(url)
            )
          )}
        </div>
      </div>
    </div>
  );
}
