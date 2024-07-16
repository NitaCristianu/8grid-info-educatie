import { useState, useEffect } from 'react';

export default function useSize() {
  const [size, setSize] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateSize = () => {
      setSize({
        x: window.innerWidth,
        y: window.innerHeight,
      });
    };

    // Initial size
    updateSize();

    // Event listener for window resize
    window.addEventListener('resize', updateSize);

    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return size;
}