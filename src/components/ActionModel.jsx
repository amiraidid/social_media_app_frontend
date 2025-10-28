import React, { useEffect, useRef, useState } from "react";
import { deleteMessage, updateMessage } from "../services/action-services";
import { FaEllipsisV, FaEdit, FaTrashAlt, FaBolt } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ActionModel({ message, setMessages }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputs, setInputs] = useState({ content: message.content });
  const dropdownRef = useRef(null);

  const token = sessionStorage.getItem("token");

  // ✅ Handle delete and edit
  const handleActions = async (id, action) => {
    try {
      if (action === "delete") {
        await deleteMessage(id, token);
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
      } else if (action === "edit") {
        setIsEditing(true);
      }
    } catch (error) {
      toast.error(error.message || `Failed to ${action} message. Please try again.`);
    } finally {
      setIsOpen(false);
    }
  };

  // ✅ Save edited message
  const handleSaveEdit = async (id) => {
    try {
      const response = await updateMessage(id, inputs.content, token);
      if (response.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === id ? { ...msg, content: inputs.content } : msg
          )
        );
        toast.success("Message updated successfully!");
      } else {
        throw new Error(response.error);
      }
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "❌ Failed to update message.");
    }
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <FaEllipsisV className="text-gray-600 hover:text-purple-500" />
      </button>

      {/* Dropdown menu */}
      {isOpen && !isEditing && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-fade-in-up z-50"
          style={{ animation: "fade-in-up 0.15s ease-out" }}
        >
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50">
            <span className="text-sm font-semibold text-gray-700">Actions</span>
            <FaBolt className="text-purple-400" />
          </div>

          <ul className="py-1">
            <li
              onClick={() => handleActions(message._id, "edit")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 cursor-pointer transition"
            >
              <FaEdit className="text-purple-500" />
              Edit Message
            </li>
            <li
              onClick={() => handleActions(message._id, "delete")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 cursor-pointer transition"
            >
              <FaTrashAlt className="text-red-500" />
              Delete Message
            </li>
          </ul>
        </div>
      )}

      {/* Edit modal */}
      {isEditing && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up z-50"
          style={{ animation: "fade-in-up 0.15s ease-out" }}
        >
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50">
            <span className="text-sm font-semibold text-gray-700">
              Edit Message
            </span>
            <FaBolt className="text-purple-400" />
          </div>

          <div className="px-4 py-3">
            <input
              type="text"
              value={inputs.content}
              onChange={(e) => setInputs({ content: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div className="flex justify-end gap-2 p-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveEdit(message._id)}
              className="bg-purple-500 text-white px-4 py-1.5 rounded-md text-sm hover:bg-purple-600 transition"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
