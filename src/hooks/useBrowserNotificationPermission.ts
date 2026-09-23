// src/hooks/useBrowserNotificationPermission.ts
import { useEffect, useState } from 'react';

export const useBrowserNotificationPermission = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    'default'
  );

  useEffect(() => {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) return 'denied';

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  return { permission, requestPermission };
};

export default useBrowserNotificationPermission;