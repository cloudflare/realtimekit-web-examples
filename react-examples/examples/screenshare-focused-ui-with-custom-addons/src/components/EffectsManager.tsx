/* eslint-disable @next/next/no-img-element */
import { RtkSwitch } from '@cloudflare/realtimekit-react-ui';
import Dialog from './Dialog';
import { useEffect, useRef, useState } from 'react';
import { storeSelector, useRtkStore } from '../lib/store';
import RealtimeKitVideoBackgroundTransformer from '@cloudflare/realtimekit-virtual-background';
import type RealtimeKitClient from '@cloudflare/realtimekit';
import type { VideoMiddleware } from '@cloudflare/realtimekit';

export const getBackgroundImage = (name: string) => `https://assets.dyte.io/backgrounds/${name}`;
const IMAGE_URLS = [
  'bg_0.jpg',
  'bg_1.jpg',
  'bg_2.jpg',
  'bg_3.jpg',
  'bg_4.jpg',
  'bg_5.jpg',
  'bg_6.jpg',
];

const MiddlewareHolder: {
  currentVideo?: VideoMiddleware;
  transformer?: RealtimeKitVideoBackgroundTransformer;
} = {};

const EffectsManager = ({
  meeting,
  isOpen,
  onClose,
}: {
  meeting: RealtimeKitClient;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const [selected, setSelected] = useState('video');
  const { effects, updateStore } = useRtkStore(storeSelector);
  const backgroundTransformerInit = useRef(false);

  useEffect(() => {
    if (MiddlewareHolder.currentVideo) {
      meeting?.self.removeVideoMiddleware(MiddlewareHolder.currentVideo);
      MiddlewareHolder.currentVideo = undefined;
    }
    const load = async () => {
      if (!meeting) return;
      let isChatSDK = false;
      if (meeting?.self.config.viewType === 'CHAT') {
        isChatSDK = true;
      }
      if (!MiddlewareHolder.transformer) {
        if (
          RealtimeKitVideoBackgroundTransformer.isSupported() &&
          !isChatSDK &&
          // prevent double init
          backgroundTransformerInit.current !== true
        ) {
          backgroundTransformerInit.current = true;
          /**
           * To customise RealtimeKitVideoBackgroundTransformer configs, please refer to https://www.npmjs.com/package/@cloudflare/realtimekit-virtual-background?activeTab=readme.
           * 
          */
          const transformer = await RealtimeKitVideoBackgroundTransformer.init({
            meeting,
            segmentationConfig: {
              pipeline: 'canvas2dCpu', // 'webgl2' | 'canvas2dCpu'
            },
          });
          MiddlewareHolder.transformer = transformer;
        } else return;
      }
      await meeting.self.setVideoMiddlewareGlobalConfig({ disablePerFrameCanvasRendering: true });
      if (effects.video.background === 'image') {
        const imageURL = `https://assets.dyte.io/backgrounds/${effects.video.backgroundImage}`;
        MiddlewareHolder.transformer
          ?.createStaticBackgroundVideoMiddleware(imageURL)
          .then((middleware: any) => {
            MiddlewareHolder.currentVideo = middleware;
            meeting?.self.addVideoMiddleware(middleware);
          });
      } else if (effects.video.background === 'blur') {
        MiddlewareHolder.transformer
          ?.createBackgroundBlurVideoMiddleware()
          .then((middleware: any) => {
            MiddlewareHolder.currentVideo = middleware;
            meeting?.self.addVideoMiddleware(middleware);
          });
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effects.video.background, effects.video.backgroundImage]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} header={'Effects'}>
      <div
        className="relative flex overflow-hidden rounded-lg w-full h-full"
        style={{ backgroundColor: '' }}
      >
        <aside>
          <button
            onClick={() => setSelected('video')}
            type="button"
            className={selected === 'video' ? 'active' : ''}
          >
            Video
          </button>
        </aside>
        <main className="">
          {selected === 'video' && (
            <div className="group">
              <h3 className="text-lg font-medium">Background</h3>
              <div className="inline-grid grid-cols-6 gap-2 mt-2">
                <div
                  className={`backgroundBox ${effects.video.background === 'none' ? 'active' : ''}`}
                >
                  <img
                    alt="None"
                    className='cursor-pointer'
                    src={getBackgroundImage('icon_none.svg')}
                    onClick={() => {
                      const newEffects = { ...effects };
                      newEffects.video.background = 'none';
                      newEffects.video.backgroundImage = '';
                      updateStore('effects', newEffects);
                    }}
                  />
                </div>

                <div
                  className={`backgroundBox ${effects.video.background === 'blur' ? 'active' : ''}`}
                >
                  <img
                    alt="Blur"
                    className='cursor-pointer'
                    src={getBackgroundImage('icon_blur.svg')}
                    onClick={() => {
                      const newEffects = { ...effects };
                      newEffects.video.background = 'blur';
                      newEffects.video.backgroundImage = '';
                      updateStore('effects', newEffects);
                    }}
                  />
                </div>
              </div>
              <div className="inline-grid grid-cols-4 gap-2 mt-4">
                {IMAGE_URLS.map((u, i) => (
                  <div
                    className={`backgroundBox ${
                      effects.video.backgroundImage === u ? 'active' : ''
                    } cursor-pointer`}
                    key={u}
                  >
                    <img
                      className={`w-14 h-14`}
                      alt={`Image ${i}`}
                      src={getBackgroundImage(u)}
                      onClick={() => {
                        const newEffects = { ...effects };
                        newEffects.video.background = 'image';
                        newEffects.video.backgroundImage = u;
                        updateStore('effects', newEffects);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </Dialog>
  );
};

export default EffectsManager;
