import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import RecordingView from '../components/RecordingView';
import Watermark, { WatermarkConfig, WatermarkPosition } from '../components/Watermark';
import { MeetingConfig } from '../types';
import FlagsmithController from '../controllers/FlagsmithController';


const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  url: "https://dyte.io/images/favicon.png",
  position: WatermarkPosition.TopLeft,
  size: {
    width: 200,
  },
  opacity: 1,
  enabled: false,
};

const DEFAULT_UIKIT = false;
const DEFAULT_WAIT_TIME_MS = 60000;

const DEFAULT_MEETING_CONFIG: MeetingConfig = {
  uiKit: DEFAULT_UIKIT,
  waitTimeMs: DEFAULT_WAIT_TIME_MS,
  watermark: DEFAULT_WATERMARK_CONFIG,
}

function RecordingPage() {
  const [searchParams,] = useSearchParams();
  const [config, setConfig] = useState<MeetingConfig | null>(null);
  const [flagsmith, setFlagsmith] = useState<FlagsmithController | null>(null);

  const authToken = searchParams.get('authToken') as string;
  let baseURI = searchParams.get('baseURI');

  useEffect(() => {

    const initializeFlagsmith = async (authToken: string) => {
      const controller = new FlagsmithController(authToken, baseURI);

      try {
        await controller.init();
      } catch (err) {
        console.error("Failed to initialize flagsmith with error", err);
      }
      setFlagsmith(controller);
    };
    if (authToken) {
      initializeFlagsmith(authToken);
    }
  }, [authToken, setFlagsmith , baseURI]);

  useEffect(() => {
    if (flagsmith === null) {
      return;
    }
  
    const configJson = searchParams.get("config");

    let parsedConfig: MeetingConfig;

    // Set defaults on config object

    if (configJson == null) {
      parsedConfig = DEFAULT_MEETING_CONFIG;
    } else {
      parsedConfig = JSON.parse(atob(configJson));
    }

    if (parsedConfig.uiKit === undefined) {
      parsedConfig.uiKit = DEFAULT_UIKIT;
    }

    if (parsedConfig.waitTimeMs === undefined) {
      parsedConfig.waitTimeMs = DEFAULT_WAIT_TIME_MS;
    }

    parsedConfig.waitTimeMs = flagsmith.getWaitTimeMS() || parsedConfig.waitTimeMs;

    if (parsedConfig.watermark === undefined) {
      parsedConfig.watermark = DEFAULT_WATERMARK_CONFIG;
    } else {
      parsedConfig.watermark = {
        ...DEFAULT_WATERMARK_CONFIG,
        ...parsedConfig.watermark,
      }
    }

    setConfig(parsedConfig);
  }, [setConfig, searchParams, flagsmith]);

  if (!authToken) {
    return (
      <p>authToken not provided in query parameters!!</p>
    );
  }

  if (config == null || flagsmith == null) {
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