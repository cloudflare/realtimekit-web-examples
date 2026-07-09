import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MeetingConfig, WatermarkPosition } from './types';

const DEFAULT_WAIT_TIME_MS = 60000;
const DEFAULT_VIDEO_UNSUBSCRIBE_PRESETS_REGEX: string[] = []; // Eg: ["Host$","^interviewer"]

const DEFAULT_MEETING_CONFIG: MeetingConfig = {
  uiKit: false,
  waitTimeMs: DEFAULT_WAIT_TIME_MS,
  watermark: {
    url: 'https://dash.cloudflare.com/favicon.ico',
    position: WatermarkPosition.TopLeft,
    size: { width: 50 },
    opacity: 1,
    enabled: false,
  },
  videoUnsubscribePresetsRegex: DEFAULT_VIDEO_UNSUBSCRIBE_PRESETS_REGEX,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  authToken: string | null = null;
  baseURI: string | null = null;
  config: MeetingConfig = DEFAULT_MEETING_CONFIG;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    const searchParams = new URLSearchParams(this.document.defaultView?.location.search);

    this.authToken = searchParams.get('authToken');
    this.baseURI = searchParams.get('baseURI');

    const configJson = searchParams.get('config');

    let parsedConfig: MeetingConfig;

    if (configJson == null) {
      parsedConfig = DEFAULT_MEETING_CONFIG;
    } else {
      try {
        parsedConfig = JSON.parse(atob(configJson));
      } catch (error) {
        console.error('Failed to parse config query parameter, using defaults:', error);
        parsedConfig = DEFAULT_MEETING_CONFIG;
      }
    }

    if (parsedConfig.uiKit === undefined) {
      parsedConfig.uiKit = false;
    }

    if (parsedConfig.waitTimeMs === undefined) {
      parsedConfig.waitTimeMs = DEFAULT_WAIT_TIME_MS;
    }

    if (!parsedConfig.videoUnsubscribePresetsRegex) {
      parsedConfig.videoUnsubscribePresetsRegex = DEFAULT_VIDEO_UNSUBSCRIBE_PRESETS_REGEX;
    }

    if (parsedConfig.watermark === undefined) {
      parsedConfig.watermark = DEFAULT_MEETING_CONFIG.watermark;
    } else {
      parsedConfig.watermark = {
        ...DEFAULT_MEETING_CONFIG.watermark,
        ...parsedConfig.watermark,
      };
    }

    this.config = parsedConfig;
  }
}
