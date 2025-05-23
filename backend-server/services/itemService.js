const prisma = require("../prisma/db");

/**
 * Get all items from the database
 * @returns {Promise<Array>} Array of item objects
 * @throws {Error} If database operation fails
 */
async function getAllItems() {
  return await prisma.items.findMany();
};

/**
 * Get a single item by ID
 * @param {number} itemId - The ID of the item to retrieve
 * @returns {Promise<Object|null>} Item object or null if not found
 * @throws {Error} If database operation fails
 */
async function getItemById(itemId) {
    return await prisma.items.findUnique({
        where: { id: parseInt(itemId) }
    });
  };