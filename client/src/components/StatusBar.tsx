import { StatusBar as NativeStatusBar } from '@capacitor/status-bar';
import React, { useEffect } from 'react';


interface StatusBarProps {
  color: string;
}

const StatusBar = ({ color } : StatusBarProps) => {
  useEffect(() => {
    NativeStatusBar.setBackgroundColor({ color });
  }, [color]);


  return null;
}

export default StatusBar;
