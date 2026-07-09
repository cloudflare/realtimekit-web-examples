import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RecordingView from '../components/RecordingView';
import Watermark, { WatermarkConfig, WatermarkPosition } from '../components/Watermark';
import { MeetingConfig } from '../types';


const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  url: "https://dash.cloudflare.com/favicon.ico",
  position: WatermarkPosition.TopLeft,
  size: {
    width: 50,
  },
  opacity: 1,
  enabled: false,
};

const DEFAULT_UIKIT = false;
const DEFAULT_WAIT_TIME_MS = 60000;
const DEFAULT_VIDEO_UNSUBSCRIBE_PRESETS_REGEX: string[] = []; // Eg: ["Host$","^interviewer"]

const DEFAULT_MEETING_CONFIG: MeetingConfig = {
  uiKit: DEFAULT_UIKIT,
  waitTimeMs: DEFAULT_WAIT_TIME_MS,
  watermark: DEFAULT_WATERMARK_CONFIG,
  videoUnsubscribePresetsRegex: DEFAULT_VIDEO_UNSUBSCRIBE_PRESETS_REGEX,
}

function RecordingPage() {
  const [searchParams,] = useSearchParams();
  const [config, setConfig] = useState<MeetingConfig | null>(null);

  const authToken = searchParams.get('authToken') as string;
  let baseURI = searchParams.get('baseURI');

  useEffect(() => {
    const configJson = searchParams.get("config");

    let parsedConfig: MeetingConfig;

    // Set defaults on config object

    if (configJson == null) {
      parsedConfig = DEFAULT_MEETING_CONFIG;
    } else {
      try {
        parsedConfig = JSON.parse(atob(configJson));
      } catch (error) {
        console.error("Failed to parse config query parameter, using defaults:", error);
        parsedConfig = DEFAULT_MEETING_CONFIG;
      }
    }

    if (parsedConfig.uiKit === undefined) {
      parsedConfig.uiKit = DEFAULT_UIKIT;
    }

    if (parsedConfig.waitTimeMs === undefined) {
      parsedConfig.waitTimeMs = DEFAULT_WAIT_TIME_MS;
    }

    if(!parsedConfig.videoUnsubscribePresetsRegex) {
      parsedConfig.videoUnsubscribePresetsRegex = DEFAULT_VIDEO_UNSUBSCRIBE_PRESETS_REGEX;
    }

    if (parsedConfig.watermark === undefined) {
      parsedConfig.watermark = DEFAULT_WATERMARK_CONFIG;
    } else {
      parsedConfig.watermark = {
        ...DEFAULT_WATERMARK_CONFIG,
        ...parsedConfig.watermark,
      }
    }

    setConfig(parsedConfig);
  }, [setConfig, searchParams]);

  if (!authToken) {
    return (
      <p>authToken not provided in query parameters!!</p>
    );
  }

  if (config == null) {
    return (
      <p>Initializing.....</p>
    )
  }


  return (
    <>
      <RecordingView 
            authToken={authToken}
            config={config}
            baseURI={baseURI}
          />

      {
        config.watermark.enabled && (
          <Watermark config={config.watermark} />
        )
      }
    </>
  );
}

export default RecordingPage;