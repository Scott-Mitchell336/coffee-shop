require('dotenv').config();

const { PrismaClient } = require('../../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.cart_items.deleteMany({});
  await prisma.carts.deleteMany({});
  await prisma.items.deleteMany({});
  await prisma.users.deleteMany({});

  console.log('Deleted existing data');

  // Create users
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('password123', saltRounds);

  const userPromises = [];
  
  // Create 2 administrators
  for (let i = 1; i <= 2; i++) {
    userPromises.push(
      prisma.users.create({
        data: {
          username: `admin${i}`,
          password: hashedPassword,
          email: `admin${i}@coffeeshop.com`,
          role: 'administrator',
        },
      })
    );
  }

  // Create 5 employees
  for (let i = 1; i <= 5; i++) {
    userPromises.push(
      prisma.users.create({
        data: {
          username: `employee${i}`,
          password: hashedPassword,
          email: `employee${i}@coffeeshop.com`,
          role: 'employee',
        },
      })
    );
  }

  // Create 20 regular users
  for (let i = 1; i <= 20; i++) {
    userPromises.push(
      prisma.users.create({
        data: {
          username: `user${i}`,
          password: hashedPassword,
          email: `user${i}@example.com`,
          role: 'user',
        },
      })
    );
  }

  const users = await Promise.all(userPromises);
  console.log(`Created ${users.length} users`);

  // Create items
  const items = [
    // Coffee drinks
    { name: 'Espresso', description: 'Strong single shot of coffee', price: 2.50, category: 'coffee', image_url: 'https://example.com/espresso.jpg' },
    { name: 'Americano', description: 'Espresso diluted with hot water', price: 3.00, category: 'coffee', image_url: 'https://example.com/americano.jpg' },
    { name: 'Cappuccino', description: 'Espresso with steamed milk and foam', price: 3.50, category: 'coffee', image_url: 'https://example.com/cappuccino.jpg' },
    { name: 'Latte', description: 'Espresso with steamed milk', price: 3.75, category: 'coffee', image_url: 'https://example.com/latte.jpg' },
    { name: 'Mocha', description: 'Espresso with chocolate and steamed milk', price: 4.00, category: 'coffee', image_url: 'https://example.com/mocha.jpg' },
    { name: 'Macchiato', description: 'Espresso with a dash of frothy milk', price: 3.25, category: 'coffee', image_url: 'https://example.com/macchiato.jpg' },
    { name: 'Flat White', description: 'Espresso with steamed milk and microfoam', price: 3.50, category: 'coffee', image_url: 'https://example.com/flatwhite.jpg' },
    { name: 'Cold Brew', description: 'Coffee brewed with cold water for 12+ hours', price: 4.25, category: 'coffee', image_url: 'https://example.com/coldbrew.jpg' },
    { name: 'Iced Coffee', description: 'Chilled coffee served over ice', price: 3.75, category: 'coffee', image_url: 'https://example.com/icedcoffee.jpg' },
    { name: 'Affogato', description: 'Espresso poured over a scoop of vanilla ice cream', price: 4.50, category: 'coffee', image_url: 'https://example.com/affogato.jpg' },
    
    // Tea
    { name: 'Earl Grey', description: 'Black tea with bergamot flavor', price: 2.75, category: 'tea', image_url: 'https://example.com/earlgrey.jpg' },
    { name: 'Green Tea', description: 'Traditional Japanese green tea', price: 2.75, category: 'tea', image_url: 'https://example.com/greentea.jpg' },
    { name: 'Chai Tea Latte', description: 'Spiced tea with steamed milk', price: 3.75, category: 'tea', image_url: 'https://example.com/chai.jpg' },
    { name: 'Chamomile Tea', description: 'Herbal tea with calming properties', price: 2.75, category: 'tea', image_url: 'https://example.com/chamomile.jpg' },
    { name: 'Matcha Latte', description: 'Japanese green tea powder with steamed milk', price: 4.25, category: 'tea', image_url: 'https://example.com/matcha.jpg' },
    { name: 'English Breakfast Tea', description: 'Traditional black tea blend', price: 2.75, category: 'tea', image_url: 'https://example.com/englishbreakfast.jpg' },
    { name: 'Peppermint Tea', description: 'Refreshing herbal tea', price: 2.75, category: 'tea', image_url: 'https://example.com/peppermint.jpg' },
    
    // Bottled drinks
    { name: 'Bottled Water', description: 'Natural spring water', price: 1.75, category: 'bottled', image_url: 'https://example.com/water.jpg' },
    { name: 'Sparkling Water', description: 'Carbonated natural spring water', price: 2.25, category: 'bottled', image_url: 'https://example.com/sparklingwater.jpg' },
    { name: 'Orange Juice', description: 'Fresh squeezed orange juice', price: 2.50, category: 'bottled', image_url: 'https://example.com/orangejuice.jpg' },
    { name: 'Apple Juice', description: 'Pure apple juice', price: 2.50, category: 'bottled', image_url: 'https://example.com/applejuice.jpg' },
    { name: 'Lemonade', description: 'Freshly made lemonade', price: 2.75, category: 'bottled', image_url: 'https://example.com/lemonade.jpg' },
    
    // Baked goods
    { name: 'Blueberry Muffin', description: 'Muffin filled with juicy blueberries', price: 2.75, category: 'baked', image_url: 'https://example.com/blueberrymuffin.jpg' },
    { name: 'Chocolate Chip Muffin', description: 'Muffin with chocolate chips', price: 2.75, category: 'baked', image_url: 'https://example.com/chocolatechip.jpg' },
    { name: 'Banana Nut Bread', description: 'Bread made with ripe bananas and walnuts', price: 3.25, category: 'baked', image_url: 'https://example.com/bananabread.jpg' },
    { name: 'Glazed Donut', description: 'Classic donut with sugar glaze', price: 1.75, category: 'baked', image_url: 'https://example.com/glazeddonut.jpg' },
    { name: 'Chocolate Donut', description: 'Donut with chocolate frosting', price: 1.75, category: 'baked', image_url: 'https://example.com/chocolatedonut.jpg' },
    { name: 'Cinnamon Roll', description: 'Sweet pastry with cinnamon filling', price: 3.50, category: 'baked', image_url: 'https://example.com/cinnamonroll.jpg' },
    { name: 'Croissant', description: 'Buttery, flaky French pastry', price: 2.75, category: 'baked', image_url: 'https://example.com/croissant.jpg' },
    { name: 'Chocolate Croissant', description: 'Croissant with chocolate filling', price: 3.25, category: 'baked', image_url: 'https://example.com/chocolatecroissant.jpg' },
    { name: 'Bagel', description: 'Plain bagel', price: 2.25, category: 'baked', image_url: 'https://example.com/bagel.jpg' },
    { name: 'Bagel with Cream Cheese', description: 'Bagel served with cream cheese', price: 3.25, category: 'baked', image_url: 'https://example.com/bagelcreamcheese.jpg' },
    
    // Sandwiches
    { name: 'Turkey & Swiss', description: 'Turkey and Swiss cheese sandwich', price: 6.75, category: 'sandwich', image_url: 'https://example.com/turkeyswiss.jpg' },
    { name: 'Ham & Cheese', description: 'Ham and cheddar cheese sandwich', price: 6.50, category: 'sandwich', image_url: 'https://example.com/hamcheese.jpg' },
    { name: 'Vegetarian', description: 'Sandwich with fresh vegetables and hummus', price: 6.25, category: 'sandwich', image_url: 'https://example.com/vegetarian.jpg' },
    { name: 'BLT', description: 'Bacon, lettuce, and tomato sandwich', price: 6.75, category: 'sandwich', image_url: 'https://example.com/blt.jpg' },
    
    // Extras
    { name: 'Extra Shot of Espresso', description: 'Add an extra shot of espresso to any drink', price: 0.75, category: 'extras', image_url: 'https://example.com/extrashot.jpg' },
    { name: 'Vanilla Syrup', description: 'Add vanilla flavor to any drink', price: 0.50, category: 'extras', image_url: 'https://example.com/vanillasyrup.jpg' },
    { name: 'Caramel Syrup', description: 'Add caramel flavor to any drink', price: 0.50, category: 'extras', image_url: 'https://example.com/caramelsyrup.jpg' },
    { name: 'Whipped Cream', description: 'Add whipped cream to any drink', price: 0.50, category: 'extras', image_url: 'https://example.com/whippedcream.jpg' },
  ];

  const createdItems = await Promise.all(
    items.map(item => prisma.items.create({ data: item }))
  );
  console.log(`Created ${createdItems.length} items`);

  // Create carts for some users
  const cartUsers = users.filter(user => user.role === 'user').slice(0, 10);
  const carts = await Promise.all(
    cartUsers.map(user => 
      prisma.carts.create({
        data: {
          user_id: user.id
        }
      })
    )
  );
  console.log(`Created ${carts.length} carts`);

  // Add items to carts
  const cartItemsData = [];
  carts.forEach(cart => {
    // Add 1-5 random items to each cart
    const numItems = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < numItems; i++) {
      const randomItem = createdItems[Math.floor(Math.random() * createdItems.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      
      // Only add if this exact item isn't already in the cart
      if (!cartItemsData.some(ci => ci.cart_id === cart.id && ci.item_id === randomItem.id)) {
        cartItemsData.push({
          cart_id: cart.id,
          item_id: randomItem.id,
          quantity: quantity,
          instructions: Math.random() > 0.7 ? 'Extra hot' : null // sometimes add instructions
        });
      }
    }
  });

  const cartItems = await Promise.all(
    cartItemsData.map(data => prisma.cart_items.create({ data }))
  );
  console.log(`Created ${cartItems.length} cart items`);

  console.log('Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });