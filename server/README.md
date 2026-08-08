# Egreen Technology — Backend API

Customer-facing backend for the Egreen Technology e-commerce platform (wholesale laptop/electronics store).

## Tech Stack

- **Runtime:** Node.js + Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** Zod
- **Logging:** Morgan

## Getting Started

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment

Edit `server/.env` and add your PostgreSQL connection string and a JWT secret:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/egreen
JWT_SECRET=your-secure-random-secret-key-here
JWT_EXPIRES_IN=1d
PORT=5000
```

> `JWT_EXPIRES_IN=1d` sets tokens to expire in exactly 24 hours.
> Generate a secure JWT secret with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 3. Run database migrations

```bash
npm run prisma:migrate
```

This creates all tables. Use `--name init` to name the migration:

```bash
npx prisma migrate dev --name init
```

### 4. (Optional) Seed the database

```bash
npm run prisma:seed
```

This populates categories, brands, and 32 products matching the frontend data.

### 5. Start the server

```bash
npm run dev    # development (auto-restart with nodemon)
# or
npm start      # production
```

Server runs on `http://localhost:5000`.

## API Endpoints

### Auth (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account (name, email, password) |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Products (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (`?category=mini-pc&search=dell&page=1&limit=20`) |
| GET | `/api/products/:id` | Get product detail |

### Cart (protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add item (`{ productId, quantity? }`) |
| PUT | `/api/cart/:itemId` | Update quantity (`{ quantity }`) |
| DELETE | `/api/cart/:itemId` | Remove item |

### Orders (protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order from cart (`{ notes? }`) |
| GET | `/api/orders` | List user's orders |
| GET | `/api/orders/:id` | Get order detail |

### Profile (protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get profile |
| PUT | `/api/users/me` | Update profile (`{ name?, phone?, companyName? }`) |

## Project Structure

```
server/
 ├── prisma/
 │    ├── schema.prisma    # Database schema
 │    └── seed.js          # Seed data (categories, brands, products)
 ├── routes/               # Express route definitions + Zod validation
 ├── controllers/          # Request handlers (thin layer)
 ├── services/             # Business logic (Prisma queries)
 ├── middleware/           # Auth, error handling, validation
 ├── utils/                # AppError, catchAsync, generateToken
 ├── uploads/              # Static file uploads
 ├── .env                  # Environment variables
 ├── index.js              # Server entry point
 └── README.md
```
