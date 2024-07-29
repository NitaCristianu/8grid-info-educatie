import { useEffect, useRef } from "react";

// returns the previous value of a state
export function usePrevious<T>(value :T ): T {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}