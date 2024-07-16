import { useEffect, useRef } from 'react';

const useFrame = (callback: () => void) => {
  // Store the callback function in a ref to ensure it always has the latest value
  const callbackRef = useRef(callback);

  // Update the ref whenever the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      callbackRef.current(); // Call the latest callback
      animationFrameId = requestAnimationFrame(animate); // Request the next frame
    };

    // Start the animation loop
    animationFrameId = requestAnimationFrame(animate);

    // Clean up the animation frame on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Empty dependency array ensures this effect runs once
};

export default useFrame;
