import { useEffect, useRef, useState } from 'react';
import {
  RtkIcon,
  RtkParticipantTile,
  RtkSettingsVideo,
  defaultIconPack,
} from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';

interface CurrentDevices {
  video?: MediaDeviceInfo;
}

function VideoPreviewPreBuilt() {
  return <RtkSettingsVideo />;
}

function VideoPreviewWithCustomUI() {
  const { meeting } = useRealtimeKitMeeting();

  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDevices, setCurrentDevices] = useState<CurrentDevices>({});
  useEffect(() => {
    if (!meeting) {
      return;
    }

    const deviceListUpdateCallback = async () => {
      setVideoDevices(await meeting.self.getVideoDevices());
    };
    meeting.self.addListener('deviceListUpdate', deviceListUpdateCallback);
    //populate first time values
    deviceListUpdateCallback();
    setCurrentDevices({
      video: meeting.self.getCurrentDevices().video,
    });
    return () => {
      meeting.self.removeListener('deviceListUpdate', deviceListUpdateCallback);
    };
  }, [meeting]);
  const setDevice = async (kind: 'video', deviceId: string) => {
    const device = videoDevices.find((d) => d.deviceId === deviceId);
    setCurrentDevices((oldDevices) => {
      return {
        ...oldDevices,
        [kind]: device,
      };
    });
    if (device != null) {
      await meeting?.self.setDevice(device);
    }
  };
  let unnamedCameraCount = 0;
  return (
    <div className="flex flex-col p-4">
      <div>
        {meeting.self.videoEnabled === true ? (
          <RtkParticipantTile participant={meeting?.self} isPreview />
        ) : (
          <div>
            <RtkParticipantTile participant={meeting?.self}>
              <div>
                <RtkIcon icon={defaultIconPack.video_off} />
                <div>Camera Off</div>
              </div>
            </RtkParticipantTile>
          </div>
        )}
      </div>
      <div>
        <label>Camera</label>
        <div>
          <select
            className="mt-2 w-full text-ellipsis bg-[#1F1F1F] p-2"
            onChange={(e) =>
              setDevice('video', (e.target as HTMLSelectElement).value)
            }
          >
            {videoDevices.map(({ deviceId, label }) => (
              <option
                key={deviceId}
                selected={currentDevices?.video?.deviceId === deviceId}
                value={deviceId}
              >
                {label || `Camera ${++unnamedCameraCount}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// export default VideoPreviewPreBuilt; // uncomment if you want to use prebuilt video preview
export default VideoPreviewWithCustomUI; // uncomment if you want custom ui for video preview
