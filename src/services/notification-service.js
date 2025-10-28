export const markNotificationAsRead = async (id, token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/notifications/${id}/seen`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const result = await response.json();
    return { success: true, result };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false };
  }
};


// Function to delete a notification by ID
export const deleteNotification = async (id, token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/notifications/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const result = await response.json();
    return { success: true, result };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { success: false };
  }
};