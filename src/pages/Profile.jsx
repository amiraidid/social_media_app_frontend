import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaUsers,
  FaUserPlus,
} from "react-icons/fa";
import useCurrentUser from "../hooks/useCurrentUser";
import { acceptFriendRequest, cancelFriendRequest, declineFriendRequest, removeFriend } from "../services/user-service";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { currentUser } = useCurrentUser();
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/profile/${currentUser._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch profile details");

        const data = await res.json();
        setFriends(data.friends || []);
        setRequests(data.requestedFriends || []);
        setIncomingRequests(data.incomingRequests || []);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [currentUser, token]);

  const handleUserActions = async (action, userId) => {
    let result;
    switch (action) {
      case "accept":
        result = await acceptFriendRequest(userId);
        break;
      case "decline":
        result = await declineFriendRequest(userId);
        break;
      case "remove":
        result = await removeFriend(userId);
        break;
      case "cancel":
        result = await cancelFriendRequest(userId);
        break;
      default:
        return;
    }

    if (result.success) {
      // Update UI accordingly
      setFriends((prev) => prev.filter((f) => f._id !== userId));
      setRequests((prev) => prev.filter((r) => r._id !== userId));
      setIncomingRequests((prev) => prev.filter((r) => r._id !== userId));
    } else {
      console.error("Error handling user action:", result.error);
    }
  }

  console.log(requests);

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <p className="text-gray-700 text-lg font-medium animate-pulse">
          Loading user data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30 transition-all duration-300 hover:shadow-2xl">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-200 pb-8">
          <div className="relative">
            <FaUserCircle className="text-gray-300 text-9xl" />
            <span className="absolute bottom-3 right-3 h-4 w-4 bg-green-400 border-2 border-white rounded-full"></span>
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              {currentUser.username}
            </h1>
            <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2 mt-2">
              <FaEnvelope className="text-blue-500" /> {currentUser.email}
            </p>
            <p className="text-gray-500 text-sm mt-2 italic">
              Joined{" "}
              {new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Friends Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-4 text-gray-800">
            <FaUsers className="text-blue-600" /> Friends
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading friends...</p>
          ) : friends.length === 0 ? (
            <div className="bg-blue-50 border border-blue-100 text-blue-600 rounded-xl p-4 text-center">
              You have no friends yet.
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-4">
              {friends.map((friend) => (
                <li
                  key={friend._id}
                  className="flex items-center justify-between bg-white/70 backdrop-blur-sm border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="text-gray-300 text-4xl" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {friend.username}
                      </p>
                      <p className="text-gray-500 text-sm">{friend.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/`)} className="text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-all">
                      Message
                    </button>
                    <button onClick={() => handleUserActions("remove", friend._id)} className="text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all">
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Friend Requests */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-4 text-gray-800">
            <FaUserPlus className="text-green-600" /> Pending Friend Requests
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading requests...</p>
          ) : requests.length === 0 ? (
            <div className="bg-green-50 border border-green-100 text-green-700 rounded-xl p-4 text-center">
              No pending friend requests.
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-4">
              {requests.map((req) => (
                <li
                  key={req._id}
                  className="flex items-center justify-between bg-white/70 backdrop-blur-sm border border-green-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="text-green-300 text-4xl" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {req?.username}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {req?.email}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleUserActions("cancel", req?._id)} className="text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all">
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Incoming Friend Requests */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-4 text-gray-800">
            <FaUserPlus className="text-yellow-600" /> Incoming Friend Requests
          </h2>
          {loading ? (
            <p className="text-gray-500">Loading incoming requests...</p>
          ) : incomingRequests.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-100 text-yellow-700 rounded-xl p-4 text-center">
              No incoming friend requests.
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-4">
              {incomingRequests.map((req) => (
                <li
                  key={req._id}
                  className="flex items-center justify-between bg-white/70 backdrop-blur-sm border border-yellow-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="text-yellow-300 text-4xl" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {req?.username}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {req?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUserActions("accept", req?._id)} className="text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg transition-all">
                      Accept
                    </button>
                    <button onClick={() => handleUserActions("decline", req?._id)} className="text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all">
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
