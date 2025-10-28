export const updateMessage = async (messageId, updatedContent, token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/messages/${messageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },

      body: JSON.stringify({ content: updatedContent }),
    });

    if (!response.ok) {
      throw new Error('Failed to update message');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error updating message:', error);
    return { success: false, error: error.message };
  }
};

export const deleteMessage = async (messageId, token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": 'application/json',
        Authorization: token,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete message');
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { success: false, error: error.message };
  }
};