import { getInitialStates, States } from '@cloudflare/realtimekit-ui';
import { create } from 'zustand';

type StatesStore = {
  states: States;
  setStates: (states: States) => void;
};

export const useStatesStore = create<StatesStore>((set) => ({
  states: getInitialStates(),
  setStates: (states) => set({ states }),
}));