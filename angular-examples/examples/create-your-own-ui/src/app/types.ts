import { RtkSidebarSection } from '@cloudflare/realtimekit-ui/dist/types/components/rtk-sidebar/rtk-sidebar';

export type CustomSideBarTabs = RtkSidebarSection | 'warnings';

export interface CustomStates {
  activeMediaPreviewModal?: boolean;
}
