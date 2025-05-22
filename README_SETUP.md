# coffee-shop

npm install

Make sure these are installed 

Main dependencies include:
- Express.js - Web framework
- Prisma - ORM for database operations
- jsonwebtoken - For JWT authentication
- bcrypt - For password hashing
- nodemon - automatically restarts your server when files change

then in the .env file you will need to modify the DATABASE_URL to use your postgres user name and password. You will also need to make a db in Postico (if you use that). The db name should be "coffee_shop_dev" like I ahve included in the URL below.

DATABASE_URL="postgresql://username:password@localhost:5432/coffee_shop_dev?schema=public"
JWT_SECRET = "bequietdonttellanyone"

PORT = 3000

Dont change anything else in this file.

Then you will need to run the commands below to setup Prisma correctly

npm install prisma --save-dev
npx prisma
npx prisma init
npx prisma migrate dev 
npx prisma generate

Once your done with that, then you will need to add this line to the "scripts" section in your package.json file. (You may not need to do this if the lie is already in the file and  your using this one and not one that you possibaly created)

"seed": "node db/seed.js"

After your modification it should look like this

  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "seed": "node db/seed.js"
  },

"seed": "node db/seed.js"

Run this command from the main coffee-shop directory

node db/seed.js

This will populate the db with test data