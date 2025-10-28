import React, { useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileModel({ currentUser }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const dropdownRef = React.useRef(null);

   function logout() {
    sessionStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div  onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 p-2 rounded-2xl bg-white/80 hover:bg-white border border-gray-200/50 hover:border-purple-200 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md">
        <div className="relative">
          <FaUserCircle
            size={32}
            className="text-gray-600 group-hover:text-purple-600 transition-colors duration-200"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-purple-700">
          {currentUser?.username}
        </span>
      </div>
      <div
        className={`z-50 ${isOpen ? "block" : "hidden"} my-4 absolute top-20 right-0 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600`}
        id="user-dropdown"
        ref={dropdownRef}
      >
        <div className="px-4 py-3">
          <span className="block text-sm text-gray-900 dark:text-white">
            {currentUser?.username}
          </span>
          <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
            {currentUser?.email}
          </span>
        </div>
        <ul className="py-2" aria-labelledby="user-menu-button">
          <li>
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Profile
            </Link>
          </li>
          <li>
            <button onClick={logout}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Sign out
            </button>
          </li>
        </ul>
      </div>
      
    </>
  );
}
