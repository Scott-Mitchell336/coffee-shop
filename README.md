Moon Rock Cafe - Coffee Shop Web Application

Overview

Moon Rock Cafe is a full-stack web application for a coffee shop that allows customers to browse menu items, add items to cart, and place orders. The application includes both guest and user checkout functionality, search capabilities, and a responsive user interface.

Technologies Used

Frontend: React, React Router, Tailwind CSS, Vite
Backend: Express.js, Prisma ORM
Database: PostgreSQL
Authentication: JWT (JSON Web Tokens)

Getting Started

Prerequisites

Node.js (v16.x or higher)
npm (v8.x or higher)
PostgreSQL (v13.x or higher)

Step 1: Clone the Repository

    git clone https://github.com/yourusername/coffee-shop.git
    cd coffee-shop

Step 2: Set Up the Database

1. Create a PostgreSQL database named coffee_shop_dev
    CREATE DATABASE coffee_shop_dev;

2. If you use a GUI tool like Postico, you can create the database through the interface

Step 3: Configure Environment Variables

    1. Backend configuration:
        In the backend-server folder create a .env file, then copy the below text into it
        Edit the .env file with your PostgreSQL credentials:

        DATABASE_URL="postgresql://username:password@localhost:5432/coffee_shop_dev?schema=public"
        JWT_SECRET="bequietdonttellanyone"
        PORT=3000

    2. Frontend configuration:
        In the front-end folder create a .env file, then copy the below text into it

        VITE_API_URL=http://localhost:3000

Step 4: Install Dependencies

    1. Install root dependencies:
        cd ..  # Return to project root
        npm install

    2. Install backend dependencies:
        cd backend-server
        npm install

    3. Install frontend dependencies:
        cd ../front-end
        npm install

Step 5: Set Up the Database Schema

    1. Navigate to the backend directory:
        cd ../backend-server

    2. Run Prisma migrations:
        npx prisma migrate dev

    3. Generate Prisma client:
        npx prisma generate

    4. Seed the database with initial data:
        npm run seed

Step 6: Start the Application

    1. From the project root, start both frontend and backend servers:
        npm run start

        This will start:

        Backend server at http://localhost:3000
        Frontend development server at http://localhost:5173
    2. Alternatively, you can start the services separately:

        For backend only:
        npm run start:backend

        For frontend only:
        npm run start:frontend

    3. For debugging:
        npm run debug

Application Structure

    • backend-server: Express server with Prisma ORM
        • routes/: API endpoints
        • services/: Business logic
        • prisma/: Database schema and migrations
        • middleware/: Authentication middleware
    
    •front-end: React application with Vite
        • src/components/: Reusable UI components
        • src/pages/: Page components
        • src/contexts/: Context providers (Auth, Cart)
        • src/api/: API service functions
        • src/utils/: Utility functions

Features

• User authentication (register, login, logout)
• Guest browsing and checkout
• Product browsing by categories
• Search functionality
• Shopping cart management
• Responsive design

License

    MIT License

Contributors

    Leslie Hernandez
    Scott Mitchell
    