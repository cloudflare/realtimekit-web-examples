import { useState, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

// Breakpoints configuration
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1080,
  xl: 2160
} as const;

export type BreakpointSize = keyof typeof breakpoints;

// Function to determine size based on width
const getSizeFromWidth = (width: number): BreakpointSize => {
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  return 'sm';
};

// Global state to store size for each meeting
const meetingSizes = new Map<string, BreakpointSize>();
const meetingListeners = new Map<string, Set<(size: BreakpointSize) => void>>();

/**
 * Custom hook to track container size based on breakpoints
 * @param meetingIdentifier - Unique identifier for the meeting container
 * @returns Current breakpoint size ('sm' | 'md' | 'lg' | 'xl')
 */
export const useContainerSize = (meetingIdentifier: string): BreakpointSize => {
  const [size, setSize] = useState<BreakpointSize>(
    meetingSizes.get(meetingIdentifier) || 'md'
  );

  useEffect(() => {
    // Add this component's setter to the listeners for this meeting
    if (!meetingListeners.has(meetingIdentifier)) {
      meetingListeners.set(meetingIdentifier, new Set());
    }
    meetingListeners.get(meetingIdentifier)!.add(setSize);

    // If size is already tracked, use it
    const existingSize = meetingSizes.get(meetingIdentifier);
    if (existingSize) {
      setSize(existingSize);
      return;
    }

    // Set up ResizeObserver for this meeting if not already done
    const containerElement = document.getElementById(meetingIdentifier);
    if (containerElement) {
      setupResizeObserver(containerElement, meetingIdentifier);
    } else {
      // If container doesn't exist yet, wait for it
      const observer = new MutationObserver(() => {
        const element = document.getElementById(meetingIdentifier);
        if (element) {
          setupResizeObserver(element, meetingIdentifier);
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // Cleanup listener on unmount
    return () => {
      meetingListeners.get(meetingIdentifier)?.delete(setSize);
      if (meetingListeners.get(meetingIdentifier)?.size === 0) {
        meetingListeners.delete(meetingIdentifier);
        meetingSizes.delete(meetingIdentifier);
      }
    };
  }, [meetingIdentifier]);

  return size;
};

// Helper function to set up ResizeObserver
const setupResizeObserver = (containerElement: HTMLElement, meetingIdentifier: string) => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width } = entry.contentRect;
      const newSize = getSizeFromWidth(width);
      
      // Update global state
      meetingSizes.set(meetingIdentifier, newSize);
      
      // Notify all listeners for this meeting
      const listeners = meetingListeners.get(meetingIdentifier);
      if (listeners) {
        listeners.forEach(listener => listener(newSize));
      }
    }
  });

  resizeObserver.observe(containerElement);
  
  // Initial size calculation
  const rect = containerElement.getBoundingClientRect();
  const initialSize = getSizeFromWidth(rect.width);
  meetingSizes.set(meetingIdentifier, initialSize);
  
  // Notify listeners of initial size
  const listeners = meetingListeners.get(meetingIdentifier);
  if (listeners) {
    listeners.forEach(listener => listener(initialSize));
  }
};

export { breakpoints };
