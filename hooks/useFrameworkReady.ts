import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    // Call the framework ready function if it exists
    if (typeof window !== 'undefined' && window.frameworkReady) {
      window.frameworkReady();
    }
    
    // No cleanup needed for this effect
  }, []); // Empty dependency array ensures this runs only once on mount
}