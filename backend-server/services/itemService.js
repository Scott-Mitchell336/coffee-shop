const prisma = require("../prisma/db");

async function getAllItems() {
  return await prisma.items.findMany();
};

async function getItemById(itemId) {
    return await prisma.items.findUnique({
        where: { id: parseInt(itemId) }
    });
  };

  async function createItem(itemData) {
    // Parse the price to a float if it's provided as a string
    if (itemData.price && typeof itemData.price === 'string') {
      itemData.price = parseFloat(itemData.price);
    }
    
    return await prisma.items.create({
      data: itemData
    });
  }

  async function updateItem(itemId, itemData) {
    // Parse the price to a float if it's provided as a string
    if (itemData.price && typeof itemData.price === 'string') {
      itemData.price = parseFloat(itemData.price);
    }
    
    return await prisma.items.update({
      where: { id: parseInt(itemId) },
      data: itemData
    });
  }

  async function deleteItem(itemId) {
    return await prisma.items.delete({
      where: { id: parseInt(itemId) }
    });
  }

  /**
 * Search for items based on query parameters
 * @param {Object} params Search parameters
 * @param {string} params.query General search term to find in name or description
 * @param {string} params.name Name to search for specifically
 * @param {string} params.category Category to filter by
 * @param {string} params.priceRange Price range in format "min-max"
 * @returns {Promise<Array>} Array of matching items
 */
async function searchItems(params) {
  const { query, name, category, priceRange } = params;
  
  // Build where clause dynamically based on provided parameters
  const whereClause = { 
    OR: [] 
  };
  
  // Handle general query parameter (search across multiple fields)
  if (query) {
    whereClause.OR.push(
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } }
    );
  }
  
  // Handle specific field searches
  if (name) {
    whereClause.OR.push({ name: { contains: name, mode: 'insensitive' } });
  }
  
  if (category) {
    whereClause.OR.push({ category: { contains: category, mode: 'insensitive' } });
  }
  
  if (priceRange) {
    const [min, max] = priceRange.split('-');
    whereClause.OR.push({ 
      price: { 
        gte: parseFloat(min || 0), 
        lte: parseFloat(max || Number.MAX_SAFE_INTEGER) 
      } 
    });
  }
  
  // If no specific search parameters were provided, return empty array
  if (whereClause.OR.length === 0) {
    return [];
  }
  
  console.log("Search query:", JSON.stringify(whereClause, null, 2));
  
  return await prisma.items.findMany({
    where: whereClause
  });
}

  module.exports = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    searchItems
  };