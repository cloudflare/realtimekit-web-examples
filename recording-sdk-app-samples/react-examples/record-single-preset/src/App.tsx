import { useEffect } from "react";
import { RealtimeKitProvider, useRealtimeKitClient } from "@cloudflare/realtimekit-react";
import RecordingView from "./components/RecordingView";
import { RealtimeKitRecording } from "@cloudflare/realtimekit-recording-sdk";

function App() {
  const [meeting, initMeeting] = useRealtimeKitClient();

  useEffect(() => {
    async function setupRealtimeKitMeeting(){
      const searchParams = new URL(window.location.href).searchParams;
  
      const authToken = searchParams.get("authToken");
  
      if (!authToken) {
        alert(
          "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
        );
        return;
      }
  
      const baseURI = searchParams.get('baseURI');
  
      const recordingSDK = new RealtimeKitRecording({ });
      const meetingObj = await initMeeting({
        authToken,
        defaults: {
          video: false,
          audio: false,
        },
        baseURI: baseURI ?? "dyte.io",
      });
      if (!meetingObj) {
        return;
      }
      await recordingSDK.init(meetingObj);
    }
    if(!meeting){
      setupRealtimeKitMeeting();
    }
  }, [meeting]);

  Object.assign(window, { meeting });

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <RealtimeKitProvider value={meeting} fallback={<div>Loading...</div>}>
      <RecordingView />
    </RealtimeKitProvider>
  );
}

export default App;
