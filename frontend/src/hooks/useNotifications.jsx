import { useState, useEffect } from "react";
import { connectSocket, getSocket } from "../services/socketService";
import { subscribeToWebPush } from "../services/webPushService";
import { fetchNotifications } from "../api/notificationApi";

export const useNotifications = () => {
  const [userId, setUserId] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const tabId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setUserId(tabId);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket(userId);
    subscribeToWebPush(userId);

    socket.on("new_notification", (n) => {
      console.log("New notification received:", n);
      setNotifications((prev) => [n, ...prev]);
      setCount((prev) => prev + 1);
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => socket.disconnect();
  }, [userId]);

  const clearNotifications = () => {
    setNotifications([]);
    setCount(0);
  };

  return { userId, notifications, isConnected, count, clearNotifications };
};