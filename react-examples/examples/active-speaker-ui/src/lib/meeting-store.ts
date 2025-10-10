import { type States } from '@cloudflare/realtimekit-ui';
import { create } from 'zustand';

type Size = 'sm' | 'md' | 'lg';

interface Dimensions {
  width: number;
  height: number;
}

export interface MeetingStore {
  isImmersiveMode: boolean;
  darkMode: boolean;
  toggleDarkMode: (val: boolean) => void;
  setIsImmersiveMode: (val: boolean) => void;
  toggleImmersiveMode: () => void;

  isActiveSpeakerMode: boolean;
  setIsActiveSpeakerMode: (val: boolean) => void;
  dimensions?: Dimensions;
  setDimensions: (dimensions: Dimensions) => void;

  size: Size;
  setSize: (size: Size) => void;

  isMobile: boolean;
  states: States;
  setStates: (states: States) => void;
}

export const useMeetingStore = create<MeetingStore>((set, get) => ({
  isActiveSpeakerMode: false,
  setIsActiveSpeakerMode: (isActiveSpeakerMode) => set({ isActiveSpeakerMode }),

  darkMode: true,
  toggleDarkMode: (darkMode) => set({ darkMode }),

  isImmersiveMode: false,
  setIsImmersiveMode: (isImmersiveMode) => set({ isImmersiveMode }),
  toggleImmersiveMode: () => set({ isImmersiveMode: !get().isImmersiveMode }),

  size: 'sm',
  setSize: (size) => set({ size }),

  dimensions: undefined,
  setDimensions: (dimensions) => {
    let size: Size = 'lg';
    if (dimensions.width < 768) {
      size = 'sm';
    } else if (dimensions.width < 1024) {
      size = 'md';
    }

    let isMobile = size === 'lg' ? false : true;

    set({ dimensions, size, isMobile });
  },

  isMobile: false,

  states: { activeSidebar: true, sidebar: 'chat' },
  setStates: (states: States) => {
    set({ states: { ...get().states, ...states } });
  },
}));
