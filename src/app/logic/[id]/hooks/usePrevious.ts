import { useRef, useEffect } from 'react';

/*
RETURNS PREVIOUS VALUE OF A STATE
*/

export function usePrevious(value: any) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}