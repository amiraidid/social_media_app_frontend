import React, { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaTimes,
  FaBell,
  FaUserCircle,
  FaRocket,
  FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/current_user";
import ProfileModel from "./ProfileModel";
import useNotifications from "../hooks/useNotifications";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isLogged = sessionStorage.getItem("token") || false;
  const [currentUser, setCurrentUser] = useState(null);
  const { notifications } = useNotifications();
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    handleCurrentUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // scroll effect for navbar style change
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (query) => {
    navigate(`/search?query=${query}`);
    setSearchQuery("");
  };

  return (
    <nav
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-md"
          : "bg-gradient-to-r from-purple-50 to-indigo-50"
      }` } ref={dropdownRef}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* ---- LOGO ---- */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-xl">C</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
            Chat<span className="text-gray-800">Hub</span>
          </h1>
        </div>

        {/* ---- RIGHT SECTION ---- */}
        <div className=" relative flex items-center gap-5">
          {isLogged ? (
            <>
              {/* Search Input */}
              <div className="hidden md:block relative w-64">
                <FaSearch
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(searchQuery);
                    }
                  }}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                />
              </div>

              {/* Notification Bell */}
              <button
                onClick={() => navigate("/notifications")}
                className="relative p-3 rounded-xl bg-white/70 hover:bg-white border border-gray-200 hover:border-purple-200 transition-all shadow-sm hover:shadow-md"
              >
                <FaBell
                  size={20}
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                />
                {notifications?.some((n) => !n.seen) && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow animate-pulse">
                    {notifications.filter((n) => !n.seen).length}
                  </span>
                )}
              </button>

              {/* Profile Avatar */}
              <ProfileModel currentUser={currentUser} />
            </>
          ) : (
            // Call-to-Action for guest users
            <button
              onClick={() => navigate("/login")}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2.5 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FaRocket className="animate-pulse" size={16} />
              <span className="font-semibold">Start Chatting</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-3 rounded-xl border transition-all duration-300 ${
              menuOpen
                ? "bg-purple-600 border-purple-600 text-white"
                : "bg-white/80 border-gray-200 text-gray-600 hover:border-purple-300"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* ---- MOBILE MENU ---- */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg animate-fadeIn">
          <div className="px-6 py-4 space-y-4">
            {isLogged ? (
              <>
                {/* Profile Summary */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <FaUserCircle size={32} className="text-purple-500" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {currentUser?.username}
                    </p>
                    <p className="text-sm text-gray-500">Online</p>
                  </div>
                </div>

                {/* Notifications */}
                <button
                  onClick={() => navigate("/notifications")}
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-purple-50 transition-all"
                >
                  <div className="relative">
                    <FaBell size={20} className="text-gray-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                      {notifications?.filter((n) => !n.seen).length || 0}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    Notifications
                  </span>
                </button>

                {/* Search Input */}
                <div className="relative">
                  <FaSearch
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(searchQuery);
                      }
                    }}
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                  />
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FaRocket size={16} />
                <span className="font-semibold">Start Chatting Now</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
