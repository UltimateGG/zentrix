import React, { useContext } from 'react';
import { Snackbar } from '.';
import { SnackbarProps } from './components/Snackbar';


interface NotificationContextProps {
  notifications: SnackbarProps[];
  addNotification: (notification: SnackbarProps) => void;
}

export const NotificationContext = React.createContext<NotificationContextProps | undefined>(undefined);
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
      {notifications.map((notification, index) => (
        <Snackbar
          {...notification}
          key={index}
          index={index}
          shown
          onDismiss={() => setNotifications(notifications.filter((_, i) => i !== index))}
        />
      ))}
    </NotificationContext.Provider>
  );
}

const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined)
    throw new Error('You are not using the correct provider.');
  return context;
}

export default useNotifications;

