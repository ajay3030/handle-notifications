export const showBrowserNotification = (notification) => {
  if (Notification.permission === "granted") {
    new Notification(`New ${notification.type}`, {
      body: notification.message,
      icon: "/notification-icon.png",
      badge: "/badge-icon.png",
    });
  }
};