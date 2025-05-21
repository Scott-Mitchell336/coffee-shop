# Coffee Shop Project Setup

This document provides step-by-step instructions for setting up the Coffee Shop project.

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- PostgreSQL (v12.x or higher)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Scott-Mitchell336/coffee-shop.git
cd coffee-shop
```

### 2. Install Dependencies

```bash
npm install
```

Main dependencies include:
- Express.js - Web framework
- Prisma - ORM for database operations
- jsonwebtoken - For JWT authentication
- bcrypt - For password hashing

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```
DATABASE_URL="postgresql://username:password@localhost:5432/coffee_shop?schema=public"
JWT_SECRET="your-secret-key"
PORT=3000
```

Replace `username`, `password` with your PostgreSQL credentials.

### 4. Set Up Database with Prisma

Generate Prisma client:

npm install prisma --save-dev
npx prisma
npx prisma init
npx prisma migrate dev 

```bash
npx prisma generate
```

Apply migrations to create database tables:

```bash
npx prisma migrate dev
```

### 5. Running the Application

Start the server in development mode:

```bash
npm run dev
```

Or for production:

```bash
npm start
```

## Project Structure

- `prisma` - Contains Prisma schema and migrations
- `db` - Database setup files
- `server` - Server configuration
- `/api` - API routes for items, cart, and authentication

## API Endpoints

The project implements the following endpoints:

### Items
- `GET /api/items` - Get all items available
- `GET /api/items/:item_id` - Get a specific item
- `POST /api/items` - Add a new item
- `PUT /api/items/:item_id` - Update an item
- `DELETE /api/items/:item_id` - Delete an item

### Cart
- `GET /api/cart/:user_id` - Get user's cart
- `POST /api/cart/:user_id/items/:item_id` - Add item to cart
- `PUT /api/cart/:user_id/items/:item_id` - Update cart item
- `DELETE /api/cart/:user_id/items/:item_id` - Remove item from cart
- `DELETE /api/cart/:user_id` - Clear user's cart

### Authentication
- `POST /api/auth/register` - Register new user (requires email, password)
- `POST /api/auth/login` - Login user (returns JWT for authentication)