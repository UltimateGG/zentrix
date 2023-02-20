import { Capacitor } from '@capacitor/core';
import { StatusBar as NativeStatusBar, Style } from '@capacitor/status-bar';
import React, { useEffect } from 'react';


interface StatusBarProps {
  color: string;
}

const StatusBar = ({ color } : StatusBarProps) => {
  useEffect(() => {
    if (Capacitor.getPlatform() === 'android') NativeStatusBar.setBackgroundColor({ color });
    else if (Capacitor.getPlatform() === 'ios') NativeStatusBar.setStyle({ style: Style.Light });
  }, [color]);


  return null;
}

export default StatusBar;
