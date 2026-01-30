import { useEffect, useMemo, useState } from 'react';
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
} from '@cloudflare/realtimekit-react';
import {
  RtkDialogManager,
  RtkUiProvider,
  UIConfig,
  createDefaultConfig,
  provideRtkDesignSystem,
  registerAddons,
} from '@cloudflare/realtimekit-react-ui';
import CustomRtkMeeting from './components/custom-rtk-meeting';
import VideoBackground from '@cloudflare/realtimekit-ui-addons/video-background';
import HandRaise from '@cloudflare/realtimekit-ui-addons/hand-raise';
import ChatHostControl from '@cloudflare/realtimekit-ui-addons/chat-host-control';
import MicHostControl from '@cloudflare/realtimekit-ui-addons/mic-host-control';
import CameraHostControl from '@cloudflare/realtimekit-ui-addons/camera-host-control';
import { getStatesStore, cleanupStores } from './store';
import { useContainerSize } from './hooks/useContainerSize';

export function Meeting(
    { authToken, baseURI, meetingIdentifier, onMeetingLeft }: { 
      authToken: string, 
      baseURI?: string, 
      meetingIdentifier: string,
      onMeetingLeft?: () => void
    }
) {
  const [meeting, initMeeting] = useRealtimeKitClient();
  
  // Create peer specific store for this meeting peer instance
  const statesStore = useMemo(() => {
    return getStatesStore(meetingIdentifier);
  }, [meetingIdentifier]);
  
  const setStates = statesStore((s: any) => s.setStates);
  const states = statesStore((s: any) => s.states);
  const [customConfig, setCustomConfig] = useState<UIConfig | null>(createDefaultConfig());
  const size = useContainerSize(meetingIdentifier);

  // Cleanup store when component unmounts
  useEffect(() => {
      return () => {
        cleanupStores(meetingIdentifier);
      };
  }, [meetingIdentifier]);

  // Listen for roomLeft event to trigger callback
  useEffect(() => {
    if (!meeting?.self || !onMeetingLeft) return;

    const handleRoomLeft = () => {
      console.log('Room left event detected');
      onMeetingLeft();
    };

    meeting.self.on('roomLeft', handleRoomLeft);

    return () => {
      meeting.self.off('roomLeft', handleRoomLeft);
    };
  }, [meeting, onMeetingLeft]);

  useEffect(() => {
      async function setupUiKitAddons(){
        if (!meeting) return;
        // Register UI kit addons
        const videoBackground = await VideoBackground.init({
          modes: ["blur", "virtual", "random"],
          blurStrength: 30, // 0 - 100 for opacity
          meeting: meeting!,
          images: [
              "https://images.unsplash.com/photo-1487088678257-3a541e6e3922?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3",
              "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3",
              "https://images.unsplash.com/photo-1600431521340-491eca880813?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3"
          ],
          randomCount: 10,
          selector: `#${meetingIdentifier}`
        });

        const handRaise = await HandRaise.init({
          meeting,
          canRaiseHand: true,
          canManageRaisedHand: true,
          handRaiseIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M10 4.25C10 3.69772 9.55228 3.25 9 3.25C8.44772 3.25 8 3.69772 8 4.25V10.9982C8 11.2743 7.77614 11.4982 7.5 11.4982C7.22386 11.4982 7 11.2743 7 10.9982V5.99683C7 5.44454 6.55228 4.99683 6 4.99683C5.44772 4.99683 5 5.44454 5 5.99683V14.7536C5 16.933 6.16842 19.263 6.91404 20.5425C7.47017 21.4969 8.49409 22.0013 9.53657 22.0013H11.7046C12.9358 22.0013 14.0613 21.3056 14.6118 20.2043L14.7451 19.9374C15.1658 19.0957 15.6904 18.31 16.3067 17.5989L18.5186 15.0468L20.7105 13.342C20.8931 13.1999 21 12.9814 21 12.75C21 12.2651 20.7409 11.9051 20.4084 11.6903C20.1123 11.499 19.7584 11.4172 19.4464 11.3802C18.8102 11.3047 18.0364 11.3818 17.3571 11.5137C16.8436 11.6134 16.3829 11.8077 16 12.0182V4.25C16 3.69772 15.5523 3.25 15 3.25C14.4477 3.25 14 3.69772 14 4.25V10.5C14 10.7761 13.7761 11 13.5 11C13.2239 11 13 10.7761 13 10.5V2.99683C13 2.44454 12.5523 1.99683 12 1.99683C11.4477 1.99683 11 2.44454 11 2.99683V10.5C11 10.7761 10.7761 11 10.5 11C10.2239 11 10 10.7761 10 10.5V4.25Z" fill="#F4C534"/></svg>'
      });
      
      const chatHostControl = await ChatHostControl.init({
          meeting,
          hostPresets: ['Video Call Host Demo', 'Webinar Host Demo'],
          targetPresets: ['Video Call Host Demo', 'Video Call Participant Demo', 'Webinar Host Demo', 'Webinar Participant Demo'],
          addActionInParticipantMenu: true,
      });
      
      const micHostControl = await MicHostControl.init({
          meeting,
          hostPresets: ['Video Call Host Demo', 'Webinar Host Demo'],
          targetPresets: ['Video Call Host Demo', 'Video Call Participant Demo', 'Webinar Host Demo', 'Webinar Participant Demo'],
          addActionInParticipantMenu: true,
      });
      
      const cameraHostControl = await CameraHostControl.init({
          meeting,
          hostPresets: ['Video Call Host Demo', 'Webinar Host Demo'],
          targetPresets: ['Video Call Host Demo', 'Video Call Participant Demo', 'Webinar Host Demo', 'Webinar Participant Demo'],
          addActionInParticipantMenu: true,
      });
  
        const newConfig = registerAddons([videoBackground, handRaise, chatHostControl, micHostControl, cameraHostControl], meeting!);

        // This code ensure full screen toggle works fine. This will be ported to @cloudflare/realtimekit-ui-addons soon.
        if (newConfig.root && Array.isArray(newConfig.root['div#controlbar-left'])) {
          const fullScreenToggleIndex = newConfig.root['div#controlbar-left'].indexOf('rtk-fullscreen-toggle');
          if(fullScreenToggleIndex > -1){
              newConfig.root['div#controlbar-left'][fullScreenToggleIndex] = ['rtk-fullscreen-toggle', {
                  variant: 'vertical',
                  targetElement: document.getElementById(meetingIdentifier)!
              }];
          }
      }
      // Handle smaller screens
      ['rtk-more-toggle.activeMoreMenu', 'rtk-more-toggle.activeMoreMenu.md', 'rtk-more-toggle.activeMoreMenu.sm'].forEach((configElemKey) => {
          const configElem = newConfig?.root?.[configElemKey] as any;
          configElem?.forEach((dyteElemConfigSet: any) => {
              if (dyteElemConfigSet[0] === 'rtk-fullscreen-toggle') {
                  dyteElemConfigSet[1].targetElement = document.getElementById(meetingIdentifier)!;
              }
          });
      });

        setCustomConfig(newConfig);
      } 
      setupUiKitAddons();
    }, [meeting]);

  useEffect(() => {

    if (!initMeeting || !authToken) {
      console.log(`[${meetingIdentifier}] Missing initMeeting or authToken`);
      return;
    }

    provideRtkDesignSystem(document.body, {
      theme: 'light',
    });

    initMeeting({
      authToken,
      defaults: {
        audio: false,
        video: false,
      },
      ...(baseURI && { baseURI }),
      modules: {
        devTools: {
          logs: false,
        }
      }
    })
    .then(() => {
      console.log(`[${meetingIdentifier}] Meeting initialized`);
    })
    .catch((error) => {
      console.error(`[${meetingIdentifier}] Error initializing meeting:`, error);
    });
  }, [initMeeting, authToken, baseURI, meetingIdentifier]);



  return (
    <div className="flex flex-col w-full h-full overflow-hidden" data-meeting-id={meetingIdentifier}>
        <RealtimeKitProvider value={meeting}>
            <RtkUiProvider
                meeting={meeting}
                config={customConfig!}
                showSetupScreen
                style={{ height: '100%', width: '100%', display: 'block', overflow: 'hidden' }}
                ref={(el) => {
                  if (!el) return;
                  
                  const handleStateUpdate = (e: CustomEvent) => {
                    // Only update states if this event is for our meeting
                    if (!meeting?.self?.id || e.detail?.peerId !== meeting?.self?.id) return;
                    console.log(`[${meetingIdentifier}] States updated:`, e.detail);
                    setStates(e.detail);
                  };
                  
                  // Add new listener
                  el.addEventListener('rtkStatesUpdate', handleStateUpdate);
                  
                  // Cleanup listener on unmount
                  return () => {
                    el.removeEventListener('rtkStatesUpdate', handleStateUpdate);
                  };
                }} >
                      <CustomRtkMeeting meetingIdentifier={meetingIdentifier} states={states} />
                      {/* FIXME: Dialog manager is not syncing states with store for some reason */}
                      <RtkDialogManager size={size} meeting={meeting} states={states}/>
            </RtkUiProvider>
        </RealtimeKitProvider>
    </div>
  );
}
