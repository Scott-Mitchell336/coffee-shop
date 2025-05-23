# coffee-shop

npm install

Make sure these are installed 

Main dependencies include:
- Express.js - Web framework
- Prisma - ORM for database operations
- jsonwebtoken - For JWT authentication
- bcrypt - For password hashing
- nodemon - automatically restarts your server when files change

then in the .env file you will need to modify the DATABASE_URL to use your postgres user name and password. You will also need to make a db in Postico (if you use that). The db name should be "coffee_shop_dev" like I have included in the URL below.

DATABASE_URL="postgresql://username:password@localhost:5432/coffee_shop_dev?schema=public"
JWT_SECRET = "bequietdonttellanyone"

PORT = 3000

Dont change anything else in this file.

Then you will need to run the commands below to setup Prisma correctly

Change from the root directory to the backend-server folder and then run the 
commands below to setup prisma properly. this will install prisma in the 
backend-server folder and make sure it creates the generated folder properly

npm install prisma --save-dev
npx prisma
npx prisma init
npx prisma migrate dev 
npx prisma generate

then you can run the seed file like this to seed the db with data

npm run seed
