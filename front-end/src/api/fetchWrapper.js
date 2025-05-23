const API_BASE_URL = 'http://localhost:5173/api'; // Update this to your actual API base URL

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Add Authorization header here later if needed
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

export async function getItems() {
  return request('/items');
}

export async function getItemById(id) {
  return request(`/items/${id}`);
}

// add other API functions as needed
