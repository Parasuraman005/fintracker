/**
 * Browser Notification Utility
 */

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendNotification = async (title: string, options?: NotificationOptions) => {
  const hasPermission = await requestNotificationPermission();
  
  if (hasPermission) {
    new Notification(title, {
      icon: '/favicon.ico',
      ...options
    });
  }
};
