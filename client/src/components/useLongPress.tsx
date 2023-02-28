import { useEffect, useState } from 'react';


interface UseLongPressProps {
  callback: () => any;
  ms: number;
  activeSetter: React.Dispatch<React.SetStateAction<boolean>>;
}

const useLongPress = ({ callback, ms, activeSetter }: UseLongPressProps) => {
  const [startLongPress, setStartLongPress] = useState(false);


  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (startLongPress) timerId = setTimeout(callback, ms);

    return () => clearTimeout(timerId);
  }, [callback, ms, startLongPress]);

  useEffect(() => {
    activeSetter(startLongPress);
  }, [activeSetter, startLongPress]);

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchMove: () => setStartLongPress(false),
    onTouchEnd: () => setStartLongPress(false),
  };
}

export default useLongPress;
