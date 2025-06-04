const prisma = require("../prisma/db");
const bcrypt = require("bcrypt");


async function findUserByUsername(username) {
  return await prisma.users.findUnique({
    where: {
      username: username,
    },
  });
}

async function findUserByEmail(email) {
  return await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
}

async function registerUser(userData) {
  return await prisma.users.create({
    data: userData,
  });
}

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

async function validateUserCredentials(username, password) {
  const user = await prisma.users.findUnique({
    where: {
      username: username,
    },
  });

  console.log("Validating user credentials for:", username);
  console.log("User found:", user);
  console.log("Password provided:", password);
  // If user not found or password doesn't match, return null
  if (!user || !(await bcrypt.compare(password, user.password))) {
    console.log("Invalid credentials for user:", username);
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