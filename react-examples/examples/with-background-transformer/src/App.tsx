import { useEffect } from 'react';
import { RtkMeeting } from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitClient } from '@cloudflare/realtimekit-react';
import RealtimeKitVideoBackgroundTransformer from '@cloudflare/realtimekit-virtual-background';

declare global {
  interface Window {
    meeting: any;
  }
}

function App() {
  const [meeting, initMeeting] = useRealtimeKitClient();

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;

    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    const baseURI = searchParams.get('baseURI') || import.meta.env.VITE_BASE_URL;
    const logInConsole = searchParams.get('logInConsole') === 'true';

    (
      initMeeting({
        authToken,
        baseURI,
        modules: { devTools: { logs: logInConsole } },
      }) as any
    ).then(async (meeting: any) => {
      window.meeting = meeting;

      /**
       * To customise RealtimeKitVideoBackgroundTransformer configs, please refer to https://www.npmjs.com/package/@cloudflare/realtimekit-virtual-background?activeTab=readme.
       * 
      */
      const videoBackgroundTransformer =
        await RealtimeKitVideoBackgroundTransformer.init({
          meeting,
          segmentationConfig: {
            pipeline: 'canvas2dCpu', // 'webgl2' | 'canvas2dCpu'
          },
        });

      // The video-background-transformer provides two functionalities
      // 1. Add background blur
      // 2. Add a background image

      // 1. To add background blur, with strength of 10
      meeting.self.addVideoMiddleware(
        await videoBackgroundTransformer.createBackgroundBlurVideoMiddleware(10)
      );

      // 2. To add a background image
      // meeting.self.addVideoMiddleware(
      //   await videoBackgroundTransformer.createStaticBackgroundVideoMiddleware(
      //     'https://rtk-assets.realtime.cloudflare.com/backgrounds/bg_1.jpg'
      //   )
      // );

      // We have the following set of images for your immediate use:
      // https://rtk-assets.realtime.cloudflare.com/backgrounds/bg_1.jpg
      // https://rtk-assets.realtime.cloudflare.com/backgrounds/bg_2.jpg
      // https://rtk-assets.realtime.cloudflare.com/backgrounds/bg_3.jpg
      // https://rtk-assets.realtime.cloudflare.com/backgrounds/bg_4.jpg
      // https://rtk-assets.realtime.cloudflare.com/backgrounds/bg_5.jpg
      // https://rtk-assets.realtime.cloudflare.com/backgrounds/bg_6.jpg
      // https://rtk-assets.realtime.cloudflare.com/backgrounds/bg_7.jpg
    });
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return <RtkMeeting meeting={meeting!} />;
}

export default App;
