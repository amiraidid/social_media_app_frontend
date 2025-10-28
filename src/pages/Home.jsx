import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Messages from "./Messages";
import { getCurrentUser } from "../utils/current_user";

export default function Home() {

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Dummy data for friends list
  useEffect(() => {
      const handleCurrentUser = async () => {
        const user = await getCurrentUser();
        setCurrentUser(user);
      };
      handleCurrentUser();
    }, []);

  const friends = currentUser?.friends || [];

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  return (
    <section className="mt-20 max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-start my-25 rounded-md border border-gray-300 shadow-lg">
        {/* left side for showing Friends List */}
        <div className="w-1/2 p-2 shadow-inner border-r border-gray-300 rounded-l-md">
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-md">
            <h1 className="text-2xl font-bold mb-1">Messages</h1>
            <p className="text-purple-100 text-sm">Chat with your friends</p>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200"
              />
            </div>
          </div>
          <div className="p-4 h-[400px] overflow-y-auto">
            {/* Example friend item */}
            {filteredFriends?.map((friend) => (
              <div
                key={friend._id}
                onClick={() => setSelectedFriend(friend)}
                className="flex justify-start items-center gap-2 mb-2 p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
              >
                {/* take the first character of the username */}
                <div className="font-semibold rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">
                  {friend.username.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{friend.username}</h3>
                  <p className="text-sm text-gray-600">{friend.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right side for showing Chat Window */}
        <div className="w-full p-4 ">
          <Messages selectedFriend={selectedFriend} />
        </div>
      </div>
    </section>
  );
}
