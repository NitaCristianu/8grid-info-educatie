// src/hooks/useMouse.ts

import { useState, useEffect } from 'react';

/*

THE MOUSE HOOK
-----------------
IS USED FOR DETECING MOUSE POSITION
MOUSE BUTTONS + DOUBLE CLICK
SEE INTERFACE ABOVE FOR EXACT DATA

works based on window events nested in use efects
not for sever


*/

export interface MousePosition {
  x: number;
  y: number;
}

export interface MouseButtons {
  left: boolean;
  middle: boolean;
  right: boolean;
  doubleClick: boolean;
}

export interface MouseObject {
  position: MousePosition;
  buttons: MouseButtons;
}

const useMouse = (): MouseObject => {
  const [mouse_pos, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [mouse_btn, setMouseButtons] = useState<MouseButtons>({ left: false, middle: false, right: false, doubleClick: false });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) setMouseButtons((buttons) => ({ ...buttons, left: true }));
      if (event.button === 1) setMouseButtons((buttons) => ({ ...buttons, middle: true }));
      if (event.button === 2) setMouseButtons((buttons) => ({ ...buttons, right: true }));
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) setMouseButtons((buttons) => ({ ...buttons, left: false }));
      if (event.button === 1) setMouseButtons((buttons) => ({ ...buttons, middle: false }));
      if (event.button === 2) setMouseButtons((buttons) => ({ ...buttons, right: false }));
    };

    const handleDoubleClick = (event: MouseEvent) => {
      setMouseButtons((buttons) => ({ ...buttons, doubleClick: true }));
      setTimeout(() => {
        setMouseButtons((buttons) => ({ ...buttons, doubleClick: false }));
      }, 200); // Reset double click status after 200ms
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('dblclick', handleDoubleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('dblclick', handleDoubleClick);
    };
  }, []);

  return { position: mouse_pos, buttons: mouse_btn };
};

export default useMouse;