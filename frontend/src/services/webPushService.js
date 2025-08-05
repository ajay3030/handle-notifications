import { subscribePush } from "../api/pushApi";

export const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    console.log("Service Worker registered:", reg);
    return reg;
  } catch (e) {
    console.error("Service Worker registration failed:", e);
    return null;
  }
};

export const subscribeToWebPush = async (userId) => {
  if (!("Notification" in window)) {
    console.log("Notifications not supported, skipping web push");
    return;
  }
  let permission = Notification.permission;
  if (permission === "default") permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Notification permission denied");
    return;
  }

  const registration = await registerServiceWorker();
  if (!registration) return;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
  });

  await subscribePush(userId, subscription);
  console.log("Subscribed to web push notifications");
};