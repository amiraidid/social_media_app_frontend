import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisV, FaUserCircle } from "react-icons/fa";
import { io } from "socket.io-client";
import useCurrentUser from "../hooks/useCurrentUser";
import { toast } from "react-toastify";
import ActionModel from "../components/ActionModel";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

export default function Messages({ selectedFriend }) {
  const [inputs, setInputs] = useState({ message: "" });
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const token = sessionStorage.getItem("token");
  const { currentUser } = useCurrentUser();
  const currentUserId = currentUser?._id;
  const selectedFriendId = selectedFriend?._id;
  const messagesEndRef = useRef(null);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Create socket once
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      // console.log("✅ Connected to socket server:", newSocket.id);
      if (currentUserId) {
        newSocket.emit("join", currentUserId);
      }
    });

    newSocket.on("disconnect", () => {
      // console.log("❌ Disconnected from socket server");
      if (currentUserId) {
        newSocket.emit("disconnect", currentUserId);
      }
    });

    return () => newSocket.disconnect();
  }, [currentUserId]);

  // ✅ Join room when connected
  useEffect(() => {
    if (!socket || !currentUserId) return;

    const joinRoom = () => socket.emit("join", currentUserId);
    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", joinRoom);
    }

    return () => socket.off("connect", joinRoom);
  }, [socket, currentUserId]);

  // ✅ Listen for incoming messages (only once)
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [socket]);

  // ✅ Fetch messages when selected friend changes
  useEffect(() => {
    if (!selectedFriendId || !currentUserId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/user-messages?user1=${currentUserId}&user2=${selectedFriendId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        if (!res.ok) throw new Error(res.statusText);
        const result = await res.json();
        setMessages(Array.isArray(result) ? result.reverse() : []);
      } catch (error) {
        toast.error("❌ Failed to load messages:", error);
      }
    };

    fetchMessages();
  }, [currentUserId, selectedFriendId, token]);

  // ✅ Send message
  const handleMessage = async (e) => {
    e?.preventDefault();
    if (!inputs?.message.trim()) return;

    const newMessage = {
      _id: Date.now(), // temporary ID
      senderId: currentUserId,
      receiverId: selectedFriendId,
      content: inputs.message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, newMessage]);
    setInputs({ message: "" });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/send-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            receiverId: selectedFriendId,
            content: newMessage.content,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result?.message || "Failed to send message");

      // Emit through socket
      socket?.emit("message", {
        receiverId: selectedFriendId,
        senderId: currentUserId,
        content: newMessage.content,
      });
    } catch (error) {
      toast.error(error.message || "Error sending message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputs.message.trim() !== "") {
      e.preventDefault();
      handleMessage(e);
    }
  };

  // ✅ Default view if no friend selected
  if (!selectedFriend) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-gray-400 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
          <FaUserCircle className="text-5xl text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-600 mb-2">
          Welcome to Messages
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Select a conversation to start chatting with your friends.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-gray-300 rounded-md shadow-inner overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {selectedFriend.username
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                selectedFriend.online ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">
              {selectedFriend.username}
            </h3>
            <p
              className={`text-sm ${
                selectedFriend.online ? "text-green-600" : "text-gray-500"
              }`}
            >
              {selectedFriend.online
                ? "Online"
                : `Last seen ${selectedFriend.lastSeen || "recently"}`}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <FaEllipsisV className="text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 bg-gray-50">
        <div className="space-y-3 min-h-96 overflow-y-auto max-h-[calc(100vh-250px)]">
          {messages.length === 0 && (
            <p className="text-sm text-gray-500">No messages yet. Say hi 👋</p>
          )}
          {messages.map((msg) => {
            const isMine =
              msg?.senderId === currentUserId || msg?.sender?._id === currentUserId;
            return (
              <div className={`flex ${isMine ? "justify-end" : "justify-start"}`} key={msg?._id}>
                <div
                  key={msg?._id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={` p-2 rounded-lg shadow-sm ${
                      isMine
                        ? "bg-purple-500 text-white self-end"
                        : "bg-gray-200  text-gray-950"
                    }`}
                  >
                    <div className="text-sm break-words">{msg?.content}</div>
                    <div className="flex justify-end items-center gap-1 mt-1">
                      <span className="text-xs text-gray-600">
                        {new Date(msg?.createdAt || Date.now()).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  {isMine && (
                    <ActionModel message={msg} setMessages={setMessages} />
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-4 mt-auto p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputs.message}
          onChange={(e) => setInputs({ message: e.target.value })}
          onKeyDown={handleKeyPress}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <button
          onClick={handleMessage}
          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
