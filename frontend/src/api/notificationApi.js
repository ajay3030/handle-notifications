const BASE_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:5000/api";

export const sendNotification = (payload) =>
  fetch(`${BASE_URL}/notifications/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const sendBulkNotifications = (payload) =>
  fetch(`${BASE_URL}/notifications/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const fetchNotifications = (userId) =>
  fetch(`${BASE_URL}/notifications/${userId}`).then((r) => r.json());