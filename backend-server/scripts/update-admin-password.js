// Update administrator password with bcrypt hash
const prisma = require("../prisma/db");
const bcrypt = require("bcrypt");

async function updateAdminPassword() {
  try {
    // Find the admin user
    const admin = await prisma.users.findUnique({
      where: {
        username: 'TEST1'
      }
    });

    if (!admin) {
      console.log('Administrator user TEST1 not found');
      return;
    }

    // Hash the password properly
    const hashedPassword = await bcrypt.hash('test1', 10);
    
    // Update the admin's password
    const updatedUser = await prisma.users.update({
      where: {
        id: admin.id
      },
      data: {
        password: hashedPassword
      }
    });

    console.log('Administrator password updated successfully');
    console.log('User ID:', updatedUser.id);
    console.log('Username:', updatedUser.username);
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
