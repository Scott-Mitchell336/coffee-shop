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

async function createUser(userData) {
  return await prisma.users.create({
    data: userData
  });
}

async function updateUser(userId, userData) {
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
