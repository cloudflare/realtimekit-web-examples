import { getInitialStates, States } from '@cloudflare/realtimekit-ui';
import { create } from 'zustand';
import { CustomStates } from './types';

type StatesStore = {
  states: States;
  setStates: (states: States) => void;
};

export const useStatesStore = create<StatesStore>((set) => ({
  states: getInitialStates(),
  setStates: (states) => set({ states }),
}));

type CustomStatesStore = {
  states: CustomStates;
  setCustomStates: (states: CustomStates) => void;
};

export const useCustomStatesStore = create<CustomStatesStore>((set) => ({
  states: {},
  setCustomStates: (states) => set({ states }),
}));
