import { jwtDecode } from "jwt-decode";

export const getCurrentUser = async () => {
  const token = sessionStorage.getItem("token");
  const decoded = jwtDecode(token);
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/profile/${decoded.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        }
    });
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching current user:", error);
  }
}