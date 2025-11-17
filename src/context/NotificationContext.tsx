import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: any) => {
  const [notification, setNotification] = useState(null);
  const [visible, setVisible] = useState(false);

  const showNotification = (data: any) => {
    setNotification(data);
    setVisible(true);
  };

  const hideNotification = () => {
    setVisible(false);
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ notification, visible, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
