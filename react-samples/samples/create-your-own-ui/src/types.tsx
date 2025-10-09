import { RtkSidebarSection } from '@cloudflare/realtimekit-ui/dist/types/components/rtk-sidebar/rtk-sidebar';

export type CustomSideBarTabs = RtkSidebarSection | 'warnings';

export type CustomStates = {
  activeMediaPreviewModal?: boolean;
};

export type SetStates = React.Dispatch<React.SetStateAction<CustomStates>>;
