// Service for user-related database operations
const prisma = require("../prisma/db");


async function getAllUsers() {
  return await prisma.users.findMany();
}

async function getUserById(userId) {
  return await prisma.users.findUnique({
    where: { id: parseInt(userId) }
  });
}

const bcrypt = require("bcrypt");

async function createUser(userData) {
  // Hash password if it exists in userData
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  
  return await prisma.users.create({
    data: userData
  });
}

async function updateUser(userId, userData) {
  // If updating password, hash it first
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  
  return await prisma.users.update({
    where: { id: parseInt(userId) },
    data: userData
  });
}

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
