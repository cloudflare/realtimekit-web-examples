export enum WatermarkPosition {
  TopLeft = 'left top',
  TopRight = 'right top',
  BottomLeft = 'left bottom',
  BottomRight = 'right bottom',
}

export interface WatermarkSize {
  width?: number;
  height?: number;
}

export interface WatermarkConfig {
  url: string;
  position: WatermarkPosition;
  size: WatermarkSize;
  opacity: number;
  enabled: boolean;
}

export interface MeetingConfig {
  uiKit: boolean;
  watermark: WatermarkConfig;
  waitTimeMs: number;
  videoUnsubscribePresetsRegex?: string[];
}
