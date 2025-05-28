const API_BASE_URL = 'http://localhost:3000'; // Update to your actual API base URL

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle 204 No Content (e.g., after DELETE)
    if (response.status === 204) return null;

    const data = await response.json();

    // Handle unauthorized (token expired or invalid)
    if (response.status === 401) {
      console.warn("Token expired or invalid. Logging out.");
      localStorage.removeItem("token");
      // Optionally redirect to login:
      window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API request error:", error.message);
    throw error;
  }
}

// Public APIs
export async function getItems() {
  return request('/api/items');
}

export async function getItemById(id) {
  return request(`/api/items/${id}`);
}

// Auth APIs
export async function loginUser({ username, password }) {
  console.log("Logging in with:", { username, password });
  const result = await request("/api/auth/login", {
    method: "POST",
    body: { username, password },
  });
  localStorage.setItem("token", result.token);
  return result.token;
}

export async function registerUser({ username, password, email }) {
  const result = await request("/api/auth/register", {
    method: "POST",
    body: { username, password, email },
  });
  localStorage.setItem("token", result.token);
  return result.token;
}

export async function getCurrentUser() {
  return request("/api/auth/me");
}


export function logoutUser() {
  localStorage.removeItem("token");
}

// Item CRUD APIs
export async function createItem(data) {
  return request('/api/items', {
    method: 'POST',
    body: data,
  });
}

// Delete item by ID (admin)
export async function deleteItem(itemId) {
  return await request(`/api/items/${itemId}`, { method: 'DELETE' });
}

// Update item by ID (admin)
export async function updateItem(itemId, updatedData) {
  return await request(`/api/items/${itemId}`, {
    method: 'PUT',
    body: updatedData, 
  });
}



export default request;



