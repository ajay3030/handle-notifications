import React from "react";

export default function NotificationItem({ n }) {
  return (
    <div className="notification-item">
      <div className="notification-type">{n.type.toUpperCase()}</div>
      <div className="notification-content">
        <p>{n.message}</p>
        <small>From: {n.fromUser}</small>
        <small>Time: {new Date(n.timestamp).toLocaleTimeString()}</small>
      </div>
    </div>
  );
}