import React from "react";
import { FaBell, FaEnvelopeOpenText, FaTrash } from "react-icons/fa";
import useNotifications from "../hooks/useNotifications";
import { timeAgo } from "../utils/dateFormat";
import { toast } from "react-toastify";
import { deleteNotification, markNotificationAsRead } from "../services/notification-service";

export default function Notifications() {
  const { notifications, setNotifications } = useNotifications();
  const token = sessionStorage.getItem("token");

  const handleReadNotification = async (id) => {
    try {
        const res = await markNotificationAsRead(id, token);
        if (!res.success) {
          throw new Error(res.error || "Failed to mark notification as read");
        }
        setNotifications((prevNotifs) =>
          prevNotifs.map((notif) =>
            notif._id === id ? { ...notif, seen: true } : notif
          )
        );
      } catch (error) {
        console.error(error.message || "Failed to mark notification as read")
        toast.error(error.message || "Failed to mark notification as read");
      }
  };

  const handleDeleteNotification = async(id) => {
    try {
      const res = await deleteNotification(id, token);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete notification");
      }

      // Optimistically update the UI
      setNotifications((prevNotifs) =>
        prevNotifs.filter((notif) => notif._id !== id)
    );
    toast.success("Notification deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete notification");
    }
  }

  return (
    <section className="max-w-4xl mx-auto mt-20 bg-white shadow-xl rounded-xl p-6 min-h-[400px]">
      <div className="flex items-center gap-2 border-b pb-3 mb-4">
        <FaBell className="text-blue-500 text-2xl" />
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
      </div>

      {/* Check if empty */}
      {notifications?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-400 mt-20">
          <FaEnvelopeOpenText size={50} className="mb-3" />
          <p className="text-lg">No notifications yet</p>
        </div>
      ) : (
        <ul className="space-y-3 overflow-y-auto max-h-[70vh]">
          {notifications?.map((notif) => (
            <li
              key={notif._id}
              onClick={() => handleReadNotification(notif._id)}
              className={`flex items-start gap-3 p-4 rounded-lg border transition ${
                notif.seen
                  ? "bg-gray-50 border-gray-200"
                  : "bg-blue-50 border-blue-300"
              }`}
            >
              <div className="mt-1">
                <FaBell
                  className={`${
                    notif.seen ? "text-gray-400" : "text-blue-500"
                  } text-lg`}
                />
              </div>

              <div className="flex-1">
                <p className="text-gray-800 font-medium">{notif.content}</p>
                <p className="text-sm text-gray-500 mt-1">
                  From:{" "}
                  <span className="font-semibold text-gray-700">
                    {notif.from?.username || "Unknown"}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {timeAgo(notif.createdAt)}
                </p>
              </div>

              {/* delete notification icon */}
              <button
                onClick={() => handleDeleteNotification(notif._id)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <FaTrash />
              </button>

              {!notif.seen && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full self-center">
                  New
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
