const API_BASE_URL = "http://localhost:3000"; // Update this to your actual API base URL

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  console.log("request options =", options);
  console.log("request endpoint =", endpoint);
  console.log("request token =", token);

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  console.log("Making API request:", {
    endpoint,
    options,
    config,
  });
  console.log("config.headers =", config.headers);

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }
    return response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

// Public APIs
export async function getItems() {
  return request("/items");
}

export async function getItemById(id) {
  return request(`/items/${id}`);
}

// Auth APIs
export async function loginUser({ username, password }) {
  console.log("Logging in with:", { username, password });
  const result = await request("/api/auth/login", {
    method: "POST",
    body: { username, password },
  });
  localStorage.setItem("token", result.token);
  console.log("Login result:", result);
  return result.token; // Assuming the response contains a token
}

export async function registerUser({ username, password, email }) {
  const result = await request("/api/auth/register", {
    method: "POST",
    body: { username, password, email },
  });
  localStorage.setItem("token", result.token);
  console.log("Register result:", result);
  return result.token;
}

export default request;
