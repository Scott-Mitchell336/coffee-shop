const prisma = require("../prisma/db");

async function getCartById(user_id) {
  return await prisma.carts.findUnique({
    where: {
      user_id: parseInt(user_id),
    },
  });
}

async function createCartWithUserId(userId) {
  return await prisma.carts.create({
    data: {
      user_id: parseInt(userId),
      cart_items: [],
    },
  });
}

async function updateCart(userId, cartData) {
  return await prisma.carts.update({
    where: { user_id: parseInt(userId) },
    data: cartData,
  });
}

async function deleteCart(userId) {
  return await prisma.carts.delete({
    where: { user_id: parseInt(userId) },
  });
}

async function getAllCarts() {
  return await prisma.carts.findMany();
}

async function deleteCartById(cartId) {
  return await prisma.carts.delete({
    where: { id: parseInt(cartId) },
  });
}

module.exports = {
  getCartById,
  createCartWithUserId,
  updateCart,
  deleteCart,
  getAllCarts,
  deleteCartById,
};
