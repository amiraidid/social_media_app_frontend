export const sendFriendRequest = async (userId) => {
    try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/add-friend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({ friendId: userId }),
        });
        if (!res.ok) {
            throw new Error("Failed to send friend request");
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export const acceptFriendRequest = async (userId) => {
    try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/accept-friend-request`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({ requesterId: userId }),
        });
        if (!res.ok) {
            throw new Error("Failed to accept friend request");
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export const declineFriendRequest = async (userId) => {
    try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/friends/decline`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({ requesterId: userId }),
        });
        if (!res.ok) {
            throw new Error("Failed to decline friend request");
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export const cancelFriendRequest = async (userId) => {
    try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/friends/cancel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({ friendId: userId }),
        });
        if (!res.ok) {
            throw new Error("Failed to cancel friend request");
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export const removeFriend = async (userId) => {
    try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/remove-friend`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({ friendId: userId }),
        });
        if (!res.ok) {
            throw new Error("Failed to remove friend");
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

