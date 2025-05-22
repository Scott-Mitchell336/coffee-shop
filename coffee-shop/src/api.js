const BASE_URL = 'http://localhost:5173/api'; //update this to your actual API base URL

// Fetch all items
export async function getItems() {
  try {
    const res = await fetch(`${BASE_URL}/items`);
    if (!res.ok) throw new Error('Failed to fetch items');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fetch single item by ID
export async function getItemById(id) {
  try {
    const res = await fetch(`${BASE_URL}/items/${id}`);
    if (!res.ok) throw new Error('Failed to fetch item');
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
