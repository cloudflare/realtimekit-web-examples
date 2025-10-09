import { WatermarkConfig } from "./components/Watermark";

export interface MeetingConfig {
    uiKit: boolean;
    watermark: WatermarkConfig;
    waitTimeMs: number;
}