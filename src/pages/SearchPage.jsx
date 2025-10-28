import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import useCurrentUser from "../hooks/useCurrentUser";
import { toast } from 'react-toastify'

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedUsers, setAddedUsers] = useState([]);
  const location = useLocation();
  const { currentUser } = useCurrentUser();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/search?query=${query}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch search results");

        const data = await response.json();
        setSearchResults(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchData();
  }, [query, token]);

  // 🟢 Add Friend Handler
  const handleAddFriend = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/add-friend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            userId: currentUser._id,
            friendId: userId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send friend request");
      const result = await response.json()
      toast.info(result.message || " You have successfully sent friend request.")
      // Update UI instantly
      setAddedUsers((prev) => [...prev, userId]);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 bg-white shadow-xl rounded-xl p-6 min-h-[400px]">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for <span className="text-blue-600">"{query}"</span>
      </h1>

      {loading ? (
        <p className="text-gray-600 text-center">Loading results...</p>
      ) : searchResults.length === 0 ? (
        <p className="text-gray-600 text-center">No users found.</p>
      ) : (
        <ul className="space-y-4">
          {searchResults.map((user) => {
            const isRequested =
              addedUsers.includes(user._id) ||
              currentUser?.requestedFriends?.some(
                (req) => req.friend._id === user._id
              );

            return (
              <li
                key={user._id}
                className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition p-4 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-lg">{user.username}</p>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
                <button
                  onClick={() => handleAddFriend(user._id)}
                  disabled={isRequested}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    isRequested
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  <FaUserPlus />
                  {isRequested ? "Requested" : "Add"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
