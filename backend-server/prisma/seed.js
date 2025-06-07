require('dotenv').config();

const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.cart_item_details.deleteMany({});
  await prisma.cart_items.deleteMany({});
  await prisma.carts.deleteMany({});
  await prisma.items.deleteMany({});
  await prisma.users.deleteMany({});

  console.log('Deleted existing data');

  // Create users
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('password123', saltRounds);

  const userPromises = [];
  
  // Create 1 administrators
  // this is a special administartor
  for (let i = 1; i <= 1; i++) {
    userPromises.push(
      prisma.users.create({
        data: {
          username: `admin`,
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
    { name: 'Espresso', description: 'Strong single shot of coffee', price: 2.50, category: 'coffee', image_url: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXNwcmVzc298ZW58MHx8MHx8fDA%3D' },
    { name: 'Americano', description: 'Espresso diluted with hot water', price: 3.00, category: 'coffee', image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YW1lcmljYW5vfGVufDB8fDB8fHww' },
    { name: 'Cappuccino', description: 'Espresso with steamed milk and foam', price: 3.50, category: 'coffee', image_url: 'https://media.istockphoto.com/id/505168330/photo/cup-of-cafe-latte-with-coffee-beans-and-cinnamon-sticks.webp?a=1&b=1&s=612x612&w=0&k=20&c=VmcwnH3izQJORooYe0etG_-x60PHlV28anoOwfkaU5A=' },
    { name: 'Latte', description: 'Espresso with steamed milk', price: 3.75, category: 'coffee', image_url: 'https://images.unsplash.com/photo-1603374399574-4cf3f4d79d34?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGxhdHRlfGVufDB8fDB8fHww' },
    { name: 'Mocha', description: 'Espresso with chocolate and steamed milk', price: 4.00, category: 'coffee', image_url: 'https://images.unsplash.com/photo-1632845407875-10b4d85e6bf8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9jaGF8ZW58MHx8MHx8fDA%3D' },
    { name: 'Macchiato', description: 'Espresso with a dash of frothy milk', price: 3.25, category: 'coffee', image_url: 'https://images.unsplash.com/photo-1563090308-5a7889e40542?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1hY2NoaWF0b3xlbnwwfHwwfHx8MA%3D%3D' },
    { name: 'Flat White', description: 'Espresso with steamed milk and microfoam', price: 3.50, category: 'coffee', image_url: 'https://plus.unsplash.com/premium_photo-1673545518947-ddf3240090b1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZmxhdCUyMHdoaXRlfGVufDB8fDB8fHww' },
    { name: 'Cold Brew', description: 'Coffee brewed with cold water for 12+ hours', price: 4.25, category: 'coffee', image_url: 'https://media.istockphoto.com/id/1483663560/photo/cold-refreshing-iced-cold-brew-coffee.jpg?s=1024x1024&w=is&k=20&c=landoUhtaTTxE9OzkOZKCkDE3En_zDDGvtloJ8u5pSM=' },
    { name: 'Iced Coffee', description: 'Chilled coffee served over ice', price: 3.75, category: 'coffee', image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGxhdHRlfGVufDB8fDB8fHww' },
    { name: 'Affogato', description: 'Espresso poured over a scoop of vanilla ice cream', price: 4.50, category: 'coffee', image_url: 'https://media.istockphoto.com/id/1151360599/photo/iced-coffee-with-vanilla-ice-cream.webp?a=1&b=1&s=612x612&w=0&k=20&c=H8inrx-k7wluOkJeYQyBo2CCtirP0lZ3cVzMLGnMKBY=' },
    
    // Tea
    { name: 'Earl Grey', description: 'Black tea with bergamot flavor', price: 2.75, category: 'tea', image_url: 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVhfGVufDB8fDB8fHww' },
    { name: 'Green Tea', description: 'Traditional Japanese green tea', price: 2.75, category: 'tea', image_url: 'https://images.unsplash.com/photo-1606377695906-236fdfcef767?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZW4lMjB0ZWF8ZW58MHx8MHx8fDA%3D' },
    { name: 'Chai Tea Latte', description: 'Spiced tea with steamed milk', price: 3.75, category: 'tea', image_url: 'https://images.unsplash.com/photo-1575397282820-f72467c262e5?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Chamomile Tea', description: 'Herbal tea with calming properties', price: 2.75, category: 'tea', image_url: 'https://plus.unsplash.com/premium_photo-1661594835845-7035de5abb30?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRlYXxlbnwwfHwwfHx8MA%3D%3D' },
    { name: 'Matcha Latte', description: 'Japanese green tea powder with steamed milk', price: 4.25, category: 'tea', image_url: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWF0Y2hhJTIwbGF0dGV8ZW58MHx8MHx8fDA%3D' },
    { name: 'English Breakfast Tea', description: 'Traditional black tea blend', price: 2.75, category: 'tea', image_url: 'https://plus.unsplash.com/premium_photo-1674406481284-43eba097a291?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVhfGVufDB8fDB8fHww' },
    { name: 'Peppermint Tea', description: 'Refreshing herbal tea', price: 2.75, category: 'tea', image_url: 'https://images.unsplash.com/photo-1547825407-2d060104b7f8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRlYXxlbnwwfHwwfHx8MA%3D%3D' },
    
    // Bottled drinks
    { name: 'Bottled Water', description: 'Natural spring water', price: 1.75, category: 'bottled', image_url: 'https://images.unsplash.com/photo-1685074768747-fd936f00057e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym90dGxlZCUyMHdhdGVyJTIwYW5kJTIwanVpY2VzJTIwZm9yJTIwc2FsZXxlbnwwfHwwfHx8MA%3D%3D' },
    { name: 'Sparkling Water', description: 'Carbonated natural spring water', price: 2.25, category: 'bottled', image_url: 'https://images.unsplash.com/photo-1685074768747-fd936f00057e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym90dGxlZCUyMHdhdGVyJTIwYW5kJTIwanVpY2VzJTIwZm9yJTIwc2FsZXxlbnwwfHwwfHx8MA%3D%3D' },
    { name: 'Orange Juice', description: 'Fresh squeezed orange juice', price: 2.50, category: 'bottled', image_url: 'https://images.unsplash.com/photo-1685074768747-fd936f00057e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym90dGxlZCUyMHdhdGVyJTIwYW5kJTIwanVpY2VzJTIwZm9yJTIwc2FsZXxlbnwwfHwwfHx8MA%3D%3D' },
    { name: 'Apple Juice', description: 'Pure apple juice', price: 2.50, category: 'bottled', image_url: 'https://images.unsplash.com/photo-1685074768747-fd936f00057e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym90dGxlZCUyMHdhdGVyJTIwYW5kJTIwanVpY2VzJTIwZm9yJTIwc2FsZXxlbnwwfHwwfHx8MA%3D%3D' },
    { name: 'Lemonade', description: 'Freshly made lemonade', price: 2.75, category: 'bottled', image_url: 'https://images.unsplash.com/photo-1685074768747-fd936f00057e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym90dGxlZCUyMHdhdGVyJTIwYW5kJTIwanVpY2VzJTIwZm9yJTIwc2FsZXxlbnwwfHwwfHx8MA%3D%3D' },
    
    // Baked goods
    { name: 'Blueberry Muffin', description: 'Muffin filled with juicy blueberries', price: 2.75, category: 'baked', image_url: 'https://images.unsplash.com/photo-1722251172903-cc8774501df7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ymx1ZWJlcnJ5JTIwbXVmZmlufGVufDB8fDB8fHww' },
    { name: 'Chocolate Chip Muffin', description: 'Muffin with chocolate chips', price: 2.75, category: 'baked', image_url: 'https://images.unsplash.com/photo-1637861004744-0f846ef2df40?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hvY29sYXRlJTIwY2hpcCUyMG11ZmZpbnxlbnwwfHwwfHx8MA%3D%3D' },
    { name: 'Banana Nut Bread', description: 'Bread made with ripe bananas and walnuts', price: 3.25, category: 'baked', image_url: 'https://media.istockphoto.com/id/2201866698/photo/gluten-free-and-lactose-free-date-banana-walnuts-bread-loaf-close-up-on-wooden-board.webp?a=1&b=1&s=612x612&w=0&k=20&c=r1X3XF2pO-BqFjvtY_oMCqUPwQERn0RgnI9c0bDl_7U=' },
    { name: 'Glazed Donut', description: 'Classic donut with sugar glaze', price: 1.75, category: 'baked', image_url: 'https://images.unsplash.com/photo-1709188866085-923eb283a55a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGdsYXplZCUyMGRvbnV0fGVufDB8fDB8fHww' },
    { name: 'Chocolate Donut', description: 'Donut with chocolate frosting', price: 1.75, category: 'baked', image_url: 'https://images.unsplash.com/photo-1709188865978-076be0382960?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdsYXplZCUyMGRvbnV0fGVufDB8fDB8fHww' },
    { name: 'Cinnamon Roll', description: 'Sweet pastry with cinnamon filling', price: 3.50, category: 'baked', image_url: 'https://images.unsplash.com/photo-1593872571314-4a735d4b27b0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2lubmFtb24lMjByb2xsfGVufDB8fDB8fHww' },
    { name: 'Croissant', description: 'Buttery, flaky French pastry', price: 2.75, category: 'baked', image_url: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3JvaXNzYW50fGVufDB8fDB8fHww' },
    { name: 'Chocolate Croissant', description: 'Croissant with chocolate filling', price: 3.25, category: 'baked', image_url: 'https://media.istockphoto.com/id/1382276576/photo/belgian-chocolate-mousse-croissant.webp?a=1&b=1&s=612x612&w=0&k=20&c=ESUXLlLGeaQqBEEQZnCDIqiLSXZcFkB9eKFL1PCN1Ds=' },
    { name: 'Bagel', description: 'Plain bagel', price: 2.25, category: 'baked', image_url: 'https://images.unsplash.com/photo-1627308595260-6fad84c40413?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFnZWx8ZW58MHx8MHx8fDA%3D' },
    { name: 'Bagel with Cream Cheese', description: 'Bagel served with cream cheese', price: 3.25, category: 'baked', image_url: 'https://media.istockphoto.com/id/171333940/photo/bagel.webp?a=1&b=1&s=612x612&w=0&k=20&c=NqZOtx_clkGxzTkQZK4QFk1QCTWdjGKe7JxWjYWawik=' },
    
    // Sandwiches
    { name: 'Turkey & Swiss', description: 'Turkey and Swiss cheese sandwich', price: 6.75, category: 'sandwich', image_url: 'https://media.istockphoto.com/id/2181353563/photo/left-over-roast-turkey-and-swiss-sandwich.webp?a=1&b=1&s=612x612&w=0&k=20&c=5VStwnTZLQqf-kIidkaO2vJusswCiQcWc7P0vrSF2Cg=' },
    { name: 'Ham & Cheese', description: 'Ham and cheddar cheese sandwich', price: 6.50, category: 'sandwich', image_url: 'https://media.istockphoto.com/id/155355356/photo/grilled-ham-and-cheese-panini-sandwich-on-wood-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=FRvxabZbyUME8hYzf1VMDDrjo48RQ_UT3hyM_5VPlFI=' },
    { name: 'Vegetarian', description: 'Sandwich with fresh vegetables and hummus', price: 6.25, category: 'sandwich', image_url: 'https://media.istockphoto.com/id/474920348/photo/vegetable-sandwichs-on-a-rustic-wood-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=xFtLkRGv9RMfcbsm7EJk0sok2On-cSXskNuwksIVpYo=' },
    { name: 'BLT', description: 'Bacon, lettuce, and tomato sandwich', price: 6.75, category: 'sandwich', image_url: 'https://media.istockphoto.com/id/154917899/photo/blt-sandwich.webp?a=1&b=1&s=612x612&w=0&k=20&c=gdVxf4QcE_WWIICtghe6stem3Ecq6-6QZWbgmaKahjA=' },
    
    // Extras
    { name: 'Extra Shot of Espresso', description: 'Add an extra shot of espresso to any drink', price: 0.75, category: 'extras', image_url: 'https://media.istockphoto.com/id/1837342112/photo/espresso-shots-on-a-bar-counter-in-a-coffee-shop-in-kuwait.webp?a=1&b=1&s=612x612&w=0&k=20&c=vIKDhQr99H7IAN5JRj2pwRt67VEXidHdKI7iyHTzaHE=' },
    { name: 'Vanilla Syrup', description: 'Add vanilla flavor to any drink', price: 0.50, category: 'extras', image_url: 'https://media.istockphoto.com/id/914801648/photo/close-up-of-medicine-being-poured-onto-a-teaspoon.webp?a=1&b=1&s=612x612&w=0&k=20&c=AjB9R59E85iG7mt5JHAzY7XSuXda11Cl1MUtAePGggk=' },
    { name: 'Caramel Syrup', description: 'Add caramel flavor to any drink', price: 0.50, category: 'extras', image_url: 'https://plus.unsplash.com/premium_photo-1695397425129-1012566eb3a3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dmFuaWxsYSUyMHN5cnVwJTIwZm9yJTIwY29mZmVlfGVufDB8fDB8fHww' },
    { name: 'Whipped Cream', description: 'Add whipped cream to any drink', price: 0.50, category: 'extras', image_url: 'https://images.unsplash.com/photo-1482623167695-c6268f3eb9b3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2hpcHBlZCUyMGNyZWFtfGVufDB8fDB8fHww' },
  ];

  const createdItems = await Promise.all(
    items.map(item => prisma.items.create({ data: item }))
  );
  console.log(`Created ${createdItems.length} items`);

  // Create carts for some users
 /* const cartUsers = users.filter(user => user.role === 'user').slice(0, 10);
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
  // First, create cart_items for each cart
  const cartItemsData = [];
  // For simplicity, let's create just one cart_item per cart initially
  carts.forEach(cart => {
    cartItemsData.push({
      cart_id: cart.id
    });
  });

  const cartItems = await Promise.all(
    cartItemsData.map(data => prisma.cart_items.create({ data }))
  );
  console.log(`Created ${cartItems.length} cart items`);

  // Now create cart_item_details that link items to cart_items
  const cartItemDetailsData = [];
  cartItems.forEach(cartItem => {
    // Add 1-5 random items to each cart_item
    const numItems = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < numItems; i++) {
      const randomItem = createdItems[Math.floor(Math.random() * createdItems.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      
      // Only add if this exact item isn't already in the details
      if (!cartItemDetailsData.some(cid => cid.cart_item_id === cartItem.id && cid.item_id === randomItem.id)) {
        cartItemDetailsData.push({
          cart_item_id: cartItem.id,
          item_id: randomItem.id,
          quantity: quantity,
          instructions: Math.random() > 0.7 ? 'Extra hot' : null // sometimes add instructions
        });
      }
    }
  });

  const cartItemDetails = await Promise.all(
    cartItemDetailsData.map(data => prisma.cart_item_details.create({ data }))
  );
  console.log(`Created ${cartItemDetails.length} cart item details`);*/

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