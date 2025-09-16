// Centralized Firebase Cloud Messaging helper
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDett0SoGzQP8puqO0x1DsPvwSZyNd4g0g",
  authDomain: "agenticemailtool.firebaseapp.com",
  projectId: "agenticemailtool",
  storageBucket: "agenticemailtool.firebasestorage.app",
  messagingSenderId: "413903835231",
  appId: "1:413903835231:web:78c4426b077a9d6aaacbea",
  measurementId: "G-88SCQ6KNC7"
};

const vapidKey = 'BDlncOKTc0exnBuydJFBKudbz8dwGZzi2UwQFLCX6lRM2q0pNpcHzlIqYBQ0wJsvdcl-6LNqw6nwAnX73U8Qyco';

let messagingInstancePromise = null;
let foregroundListenerAttached = false;

async function getMessagingInstance() {
  if (!messagingInstancePromise) {
    messagingInstancePromise = isSupported().then(supported => {
      if (!supported) {
        console.warn('FCM not supported in this browser');
        return null;
      }
      const app = initializeApp(firebaseConfig);
      return getMessaging(app);
    });
  }
  return messagingInstancePromise;
}

export async function requestAndRegisterFcmToken(userEmail) {
  if (!userEmail) return null;
  try {
    const alreadyFor = sessionStorage.getItem('fcmRegisteredFor');
    if (alreadyFor === userEmail) {
      // Already registered for this user in this session
      return sessionStorage.getItem('fcmToken') || null;
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }
    const messaging = await getMessagingInstance();
    if (!messaging) return null;
    const token = await getToken(messaging, { vapidKey }).catch(err => {
      console.error('getToken failed', err);
      return null;
    });
    if (!token) return null;
    console.log('FCM token (login-time):', token);

    await fetch('http://122.163.121.176:3006/register-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, token })
    }).catch(err => console.error('register-token failed:', err));

    sessionStorage.setItem('fcmRegisteredFor', userEmail);
    sessionStorage.setItem('fcmToken', token);

    // Attach foreground listener once token ready
    const messagingForListener = await getMessagingInstance();
    if (messagingForListener && !foregroundListenerAttached) {
      try {
        onMessage(messagingForListener, (payload) => {
          try {
            const note = {
              id: Date.now() + '-' + Math.random().toString(36).slice(2),
              title: payload?.notification?.title || payload?.data?.title || 'Notification',
              body: payload?.notification?.body || payload?.data?.body || '',
              data: payload?.data || {},
              receivedAt: new Date().toISOString(),
              icon: payload?.notification?.icon || '/notif-icon.svg'
            };
            const existing = JSON.parse(sessionStorage.getItem('inAppNotifications') || '[]');
            existing.unshift(note);
            const trimmed = existing.slice(0, 20); // keep last 20
            sessionStorage.setItem('inAppNotifications', JSON.stringify(trimmed));
            window.dispatchEvent(new CustomEvent('fcm-notification', { detail: note }));
          } catch (err) {
            console.warn('Failed to store foreground notification', err);
          }
        });
        foregroundListenerAttached = true;
      } catch (e) {
        console.warn('Failed to attach foreground onMessage listener', e);
      }
    }
    return token;
  } catch (e) {
    console.error('FCM registration error:', e);
    return null;
  }
}

export async function ensureFcmOnAppLoad() {
  // Called on App mount to handle refresh scenario (when user already logged in)
  try {
    const stored = sessionStorage.getItem('userData');
    if (!stored) return;
    let email = null;
    try {
      const parsed = JSON.parse(stored);
      email = parsed?.email || parsed?.user?.email || null;
    } catch { /* ignore */ }
    if (!email) return;
    const alreadyFor = sessionStorage.getItem('fcmRegisteredFor');
    if (alreadyFor === email) return; // already done
    await requestAndRegisterFcmToken(email);
  } catch (e) {
    console.warn('ensureFcmOnAppLoad error', e);
  }
}
