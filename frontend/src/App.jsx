import React, { useEffect } from "react";
import { useNotifications } from "./hooks/useNotifications";
import Controls from "./components/Controls";
import NotificationItem from "./components/NotificationItem";
import "./App.css";

export default function App() {
  const { userId, notifications, isConnected, count, clearNotifications } =
    useNotifications();
  const [targetUserId, setTargetUserId] = React.useState("");

  // Ask for notification permission once
  useEffect(() => {
    console.log('🔍 Environment check:');
    console.log('- VITE_API_URL:', import.meta.env.VITE_APP_API_URL);
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((p) =>
        console.log("Notification permission:", p)
      );
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1> Notification System</h1>
        <div className="user-info">
          <p>
            User ID: <code>{userId}</code>
          </p>
          <p>
            Status:
            <span className={isConnected ? "connected" : "disconnected"}>
              {isConnected ? " Connected" : " Disconnected"}
            </span>
          </p>
          <p>
            Notifications: <span className="notification-count">{count}</span>
          </p>
        </div>
      </header>

      <main className="main-content">
        <Controls
          userId={userId}
          targetUserId={targetUserId}
          setTargetUserId={setTargetUserId}
          onClear={clearNotifications}
        />
        <div className="notifications-panel">
          <h2>Live Notifications</h2>
          {notifications.length === 0 ? (
            <p>No notifications yet. Open multiple tabs and test!</p>
          ) : (
            notifications.map((n, i) => <NotificationItem key={i} n={n} />)
          )}
        </div>
      </main>
    </div>
  );
}