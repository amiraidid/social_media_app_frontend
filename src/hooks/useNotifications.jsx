import React, { useEffect, useState } from 'react'
import useCurrentUser from './useCurrentUser';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

export default function useNotifications() {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    const { currentUser } = useCurrentUser();
    const token = sessionStorage.getItem("token");


    useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    newSocket.on("connection", () => {});
    return () => {
      newSocket.disconnect();
    };
  }, []);

    useEffect(() => {
        const fetchUserNotifications = async() => {
            if (currentUser) {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user-notifications`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,
                    }
                });

                if (!res.ok) {
                    throw new Error(res.statusText)
                }

                const data = await res.json();
                setNotifications(data.notifications);
                if (socket) {
                    socket.on("receive_notification", (data) => {
                    setNotifications((prevNotifs) => [data, ...prevNotifs]);
                });
                }
                setLoading(false);
            } else {
                setNotifications([]);
            }
        }
        fetchUserNotifications()
    }, [currentUser, socket, token])

  return { notifications, setNotifications, loading }
}
