import React from 'react';
import { Snackbar } from '../Jet';
import { SnackbarProps } from '../Jet/components/Snackbar/Snackbar';


export interface NotificationContextProps {
  notifications: SnackbarProps[];
  addNotification: (notification: SnackbarProps) => void;
}
export const NotificationContext = React.createContext<NotificationContextProps>({
  notifications: [],
  addNotification: (notification: SnackbarProps) => {},
});

export const NotificationProvider = ({ children }: any) => {
  const [notifications, setNotifications] = React.useState<SnackbarProps[]>([]);

  const addNotification = (notification: SnackbarProps) => {
    if (!notification.seconds) notification.seconds = 5;
    if (!notification.position) notification.position = 'top';
    setNotifications([...notifications, notification]);
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
      {notifications.map((notification, index) => <Snackbar
        {...notification}
        key={index}
        index={index}
        shown
        onDismiss={() => setNotifications(notifications.filter((_, i) => i !== index))}
      />)}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => React.useContext(NotificationContext);
