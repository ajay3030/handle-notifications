const BASE_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:5000/api";

export const subscribePush = (userId, subscription) =>
  fetch(`${BASE_URL}/push/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, subscription }),
  });