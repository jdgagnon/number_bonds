import { useState, useEffect, useCallback } from 'react';

export const useIdleTimer = (onIdle, timeout = 60000) => { // Default timeout is 60 seconds
  const [timer, setTimer] = useState(null);

  const resetTimer = useCallback(() => {
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(onIdle, timeout);
    setTimer(newTimer);
  }, [onIdle, timeout, timer]);

  useEffect(() => {
    // List of events that indicate user activity
    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
    
    // Set up the timer when the component mounts
    resetTimer();

    // Add event listeners to reset the timer on any user activity
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Cleanup function to remove timers and event listeners
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [resetTimer]);

  return null; // This hook doesn't render anything
};