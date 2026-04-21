import { useEffect, useRef } from 'react';

export function useGameLoop(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  const lastUpdate = useRef(0);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      let requestRef: number;
      
      const tick = (time: number) => {
        if (!lastUpdate.current) {
          lastUpdate.current = time;
        }
        
        const delta = time - lastUpdate.current;
        
        if (delta >= delay) {
          savedCallback.current();
          lastUpdate.current = time;
        }
        
        requestRef = requestAnimationFrame(tick);
      };
      
      requestRef = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(requestRef);
    }
  }, [delay]);
}
