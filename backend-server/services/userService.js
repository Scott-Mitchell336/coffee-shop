// Service for user-related database operations
const prisma = require("../prisma/db");

/**
 * Get all users from the database
 * @returns {Promise<Array>} Array of user objects
 * @throws {Error} If database operation fails
 */
async function getAllUsers() {
  return await prisma.users.findMany();
}

/**
 * Get a single user by ID
 * @param {number} userId - The ID of the user to retrieve
 * @returns {Promise<Object|null>} User object or null if not found
 * @throws {Error} If database operation fails
 */
async function getUserById(userId) {
  return await prisma.users.findUnique({
    where: { id: parseInt(userId) }
  });
}

/**
 * Create a new user
 * @param {Object} userData - User data (username, email, password, etc.)
 * @returns {Promise<Object>} Created user object
 * @throws {Error} If database operation fails
 */
async function createUser(userData) {
  return await prisma.users.create({
    data: userData
  });
}

/**
 * Update an existing user
 * @param {number} userId - ID of user to update
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user object
 * @throws {Error} If database operation fails
 */
async function updateUser(userId, userData) {
  return await prisma.users.update({
    where: { id: parseInt(userId) },
    data: userData
  });
}

/**
 * Delete a user
 * @param {number} userId - ID of user to delete
 * @returns {Promise<Object>} Deleted user object
 * @throws {Error} If database operation fails
 */
async function deleteUser(userId) {
  return await prisma.users.delete({
    where: { id: parseInt(userId) }
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
