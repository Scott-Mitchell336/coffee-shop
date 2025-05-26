const API_BASE_URL = 'http://localhost:3000/api'; // Update this to your actual API base URL

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }
    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Public APIs
export async function getItems() {
  return request('/items');
}

export async function getItemById(id) {
  return request(`/items/${id}`);
}

// Auth APIs
export async function loginUser({ username, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: { username, password },
  });
}

export async function registerUser({ username, password, email, }) {
  return request('/auth/register', {
    method: 'POST',
    body: { username, password, email },
  });
}

export default request;


