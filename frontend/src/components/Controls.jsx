import React from "react";
import { sendNotification, sendBulkNotifications } from "../api/notificationApi";

export default function Controls({
  userId,
  targetUserId,
  setTargetUserId,
  onClear,
}) {
  const send = (type) => {
    if (!targetUserId.trim()) {
      alert("Please enter a target user ID!");
      return;
    }
    sendNotification({
      type,
      fromUser: "test_user",
      toUser: targetUserId,
      postId: `post_${Date.now()}`,
      message: `You received a new ${type}!`,
    });
    console.log(`✅ Sent ${type} from ${userId} to ${targetUserId}`);
  };

  const bulk = () => {
    if (!targetUserId.trim()) {
      alert("Please enter a target user ID for bulk notifications!");
      return;
    }
    sendBulkNotifications({
      count: 100,
      type: "like",
      fromUser: userId,
      toUser: targetUserId,
    });
  };

  return (
    <div className="controls">
      <h2 style={{ fontWeight: "bold", color: "#4f46e5", marginBottom: "18px" }}>Test Notifications</h2>

      <label style={{ display: "block", marginBottom: "14px" }}>
        <span style={{ fontWeight: "bold", fontSize: "15px", color: "#333", marginBottom: "6px", display: "block" }}>
          Send notification TO:
        </span>
        <div style={{ position: "relative", marginTop: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", maxWidth: "500px", width: "100%", position: "relative" }}>
            <input
              type="text"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="Paste user ID from another tab"
              style={{
                width: "100%",
                padding: "12px 40px 12px 16px",
                border: "1.5px solid #7c3aed",
                borderRadius: "8px",
                fontSize: "15px",
                background: "#f8f8ff",
                boxShadow: "0 2px 8px rgba(124, 58, 237, 0.08)",
                outline: "none",
                transition: "border-color 0.2s",
                minWidth: 0,
                boxSizing: "border-box",
                maxWidth: "500px"
              }}
              onFocus={e => e.target.style.borderColor = "#4f46e5"}
              onBlur={e => e.target.style.borderColor = "#7c3aed"}
            />
            <span style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              height: "22px",
              pointerEvents: "none"
            }}>
              <svg
                style={{
                  width: "22px",
                  height: "22px",
                  fill: "#7c3aed",
                  opacity: 0.7
                }}
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </span>
          </div>
        </div>
      </label>

      <div className="button-group" style={{ width: "100%", maxWidth: "500px", boxSizing: "border-box" }}>
        <button onClick={() => send("like")}>Send Like</button>
        <button onClick={() => send("comment")}>Send Comment</button>
        <button onClick={() => send("share")}>Send Share</button>
        <button onClick={bulk} className="bulk-btn">
          Send 100 Bulk Notifications
        </button>
        <button onClick={onClear} className="clear-btn">
          Clear Notifications
        </button>
      </div>
    </div>
  );
}