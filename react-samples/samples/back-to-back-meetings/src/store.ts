import { getInitialStates, States } from '@cloudflare/realtimekit-ui';
import { create } from 'zustand';
import { CustomStates } from './types';

type StatesStore = {
  states: States;
  setStates: (states: States) => void;
};

type CustomStatesStore = {
  states: CustomStates;
  setCustomStates: (states: CustomStates) => void;
};

// Factory function to create isolated state stores per meeting
export const createStatesStore = () => create<StatesStore>((set) => ({
  states: getInitialStates(),
  setStates: (states) => set({ states }),
}));

// Factory function to create isolated custom state stores per meeting
export const createCustomStatesStore = () => create<CustomStatesStore>((set) => ({
  states: {},
  setCustomStates: (states) => set({ states }),
}));

// Store registry to manage multiple store instances
const storeRegistry = new Map<string, ReturnType<typeof createStatesStore>>();
const customStoreRegistry = new Map<string, ReturnType<typeof createCustomStatesStore>>();

// Get or create a store instance for a specific meeting
export const getStatesStore = (meetingId: string) => {
  if (!storeRegistry.has(meetingId)) {
    const newStore = createStatesStore();
    storeRegistry.set(meetingId, newStore);
  }
  return storeRegistry.get(meetingId)!;
};

// Get or create a custom store instance for a specific meeting
export const getCustomStatesStore = (meetingId: string) => {
  if (!customStoreRegistry.has(meetingId)) {
    const newStore = createCustomStatesStore();
    customStoreRegistry.set(meetingId, newStore);
  }
  return customStoreRegistry.get(meetingId)!;
};

// Cleanup function to remove stores when meetings are destroyed
export const cleanupStores = (meetingId: string) => {
  storeRegistry.delete(meetingId);
  customStoreRegistry.delete(meetingId);
};
