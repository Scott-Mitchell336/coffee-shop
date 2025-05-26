const prisma = require("../prisma/db");
const bcrypt = require("bcrypt");

/**
 * Check if a user with the given username already exists
 * @param {string} username - The username to check
 * @returns {Promise<object|null>} - The user object if found, null otherwise
 */
async function findUserByUsername(username) {
  return await prisma.users.findUnique({
    where: {
      username: username,
    },
  });
}

/**
 * Check if a user with the given email already exists
 * @param {string} email - The email to check
 * @returns {Promise<object|null>} - The user object if found, null otherwise
 */
async function findUserByEmail(email) {
  return await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
}

/**
 * Register a new user
 * @param {object} userData - User data including username, email, password
 * @returns {Promise<object>} - The created user object
 */
async function registerUser(userData) {
  return await prisma.users.create({
    data: userData,
  });
}

/**
 * Find user by ID
 * @param {number} userId - User ID to find
 * @returns {Promise<object|null>} - The user object if found, null otherwise
 */
async function getUserById(userId) {
  return await prisma.users.findUnique({
    where: {
      id: userId,
    },
    // Don't include password in the response
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
    },
  });
}

/**
 * Validate user credentials for login
 * @param {string} username - Username to check
 * @param {string} password - Password to verify
 * @returns {Promise<object|null>} - The user object if credentials are valid, null otherwise
 */
async function validateUserCredentials(username, password) {
  const user = await prisma.users.findUnique({
    where: {
      username: username,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }

  return user;
}

module.exports = {
  findUserByUsername,
  findUserByEmail,
  registerUser,
  getUserById,
  validateUserCredentials,
};