import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { theme } from '../Jet';


interface DraggableOverlayProps {
  threshold?: number;
  onClose?: () => any;
  children: React.ReactNode;
}

const DraggableOverlay = ({ threshold, onClose, children }: DraggableOverlayProps) => {
  const [snappingBack, setSnappingBack] = useState(false);
  const ref = useRef<HTMLDivElement>(null);


  const passedThreshold = (e: any) => {
    if (!ref.current) return false;
    const left = new DOMMatrixReadOnly(window.getComputedStyle(ref.current).transform).m41;
    const width = ref.current.clientWidth;
    const percent = left / width * 100;

    return percent >= (threshold || 10);
  }

  const onStop = (e: any) => {
    if (!passedThreshold(e)) {
      setSnappingBack(true);
      setTimeout(() => setSnappingBack(false), 200);
      return;
    }

    if (onClose) onClose();
  }

  return (
    <Draggable
      axis="x"
      bounds={{
        left: 0,
      }}
      position={{ x: 0, y: 0 }}
      onStop={onStop}
    >
      <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 11,
          boxShadow: '0 0 0.8rem rgba(0, 0, 0, 0.5)',
          transition: snappingBack ? 'transform 0.2s ease-in-out' : 'none',
          backgroundColor: theme.colors.background[0],
        }}
        ref={ref}
      >
        {children}
      </div>
    </Draggable>
  );
}

export default DraggableOverlay;