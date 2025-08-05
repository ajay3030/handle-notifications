import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:5000/api";

let socket;

export const connectSocket = (userId) => {
  if (socket) socket.disconnect();
  socket = io(`${BASE_URL}`);
  socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("register_user", userId);
  });
  socket.on("disconnect", () => console.log("Disconnected from server"));
  return socket;
};

export const getSocket = () => socket;