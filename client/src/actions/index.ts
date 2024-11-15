"use server";
import { SERVER_URL } from "@/lib/config";
import { cookies } from "next/headers";

export async function fetchUsers() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Cookie: `token=${token.value}` } : {}),
    };

    const response = await fetch(`${SERVER_URL}getAllUser`, {
      method: "GET",
      headers,
      credentials: "include", // This is equivalent to withCredentials: true in Axios
    });

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON from the response
    return data.data; // Adjust according to your API response structure
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
}
