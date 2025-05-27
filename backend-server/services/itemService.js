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

  module.exports = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
  };