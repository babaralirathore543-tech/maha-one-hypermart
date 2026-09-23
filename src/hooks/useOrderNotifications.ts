// src/hooks/useOrderNotifications.ts
import { useEffect, useRef, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

interface UseOrderNotificationsOptions {
  role: 'seller' | 'admin';
  sellerId?: string;
  onNewOrder?: (order: any) => void;
  playSound?: boolean;
  showBrowserNotification?: boolean;
}

interface OrderNotificationState {
  count: number;
  unreadCount: number;
  latestOrder: any | null;
  markAllRead: () => void;
}

// ============================================================
// SOUND — Web Audio API beep
// ============================================================
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();

      osc2.connect(gain2);
      gain2.connect(audioContext.destination);

      osc2.frequency.value = 1000;
      osc2.type = 'sine';

      gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.5);
    }, 200);
  } catch (error) {
    console.warn('Sound play failed:', error);
  }
};

// ============================================================
// ✅ BROWSER NOTIFICATION — Renamed to avoid conflict
// ============================================================
const displayBrowserNotification = (
  title: string,
  body: string,
  icon?: string
) => {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/logo.png',
      badge: '/logo.png',
      tag: 'new-order',
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, {
          body,
          icon: icon || '/logo.png',
        });
      }
    });
  }
};

// ============================================================
// MAIN HOOK
// ============================================================
export const useOrderNotifications = ({
  role,
  sellerId,
  onNewOrder,
  playSound = true,
  showBrowserNotification: showBrowser = true,
}: UseOrderNotificationsOptions): OrderNotificationState => {
  const [count, setCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestOrder, setLatestOrder] = useState<any | null>(null);

  const isInitialized = useRef(false);
  const lastOrderId = useRef<string | null>(null);

  useEffect(() => {
    if (!sellerId && role === 'seller') return;

    let q;
    if (role === 'seller') {
      q = query(
        collection(db, 'sellerOrders'),
        where('sellerId', '==', sellerId),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
    } else {
      q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setCount(0);
          isInitialized.current = true;
          return;
        }

        setCount(snapshot.size);

        const latestDoc = snapshot.docs[0];
        const orderData = { id: latestDoc.id, ...latestDoc.data() };

        if (
          isInitialized.current &&
          lastOrderId.current &&
          lastOrderId.current !== latestDoc.id
        ) {
          // ✅ NEW ORDER!
          const orderNumber =
            orderData.orderNumber || latestDoc.id.slice(-8);
          const customerName =
            orderData.customerName ||
            orderData.userName ||
            orderData.shippingAddress?.name ||
            'Customer';
          const total = orderData.total || orderData.subtotal || 0;
          const itemCount = orderData.items?.length || 1;

          setLatestOrder(orderData);
          setUnreadCount((prev) => prev + 1);

          if (playSound) playNotificationSound();

          // ✅ FUNCTION CALL — ab conflict nahi hai
          if (showBrowser) {
            displayBrowserNotification(
              role === 'seller'
                ? `🛍️ New Order #${orderNumber}`
                : `📦 New Order #${orderNumber}`,
              `${customerName} ordered ${itemCount} item(s) — Rs. ${total.toLocaleString()}`,
              '/logo.png'
            );
          }

          toast.success(
            role === 'seller'
              ? `🛍️ New Order #${orderNumber} from ${customerName}`
              : `📦 New Order #${orderNumber} — Rs. ${total.toLocaleString()}`,
            {
              duration: 6000,
              style: {
                background: '#0F766E',
                color: '#fff',
                fontWeight: '600',
              },
            }
          );

          if (onNewOrder) onNewOrder(orderData);
        }

        lastOrderId.current = latestDoc.id;
        isInitialized.current = true;
      },
      (error) => {
        console.error('Order notifications listener error:', error);
      }
    );

    return () => unsubscribe();
  }, [role, sellerId, onNewOrder, playSound, showBrowser]);

  const markAllRead = () => setUnreadCount(0);

  return { count, unreadCount, latestOrder, markAllRead };
};

export default useOrderNotifications;