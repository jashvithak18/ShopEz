# ShopEz 🛒

Welcome to **ShopEz**, a premium, feature-rich e-commerce web application designed for a modern shopping experience. The application features a highly responsive and dynamic user interface, complete catalog navigation, product search with personalized recommendations, cart/wishlist management, user authentication, review systems, mock checkout flows, and address management.

---

## 🌟 Key Features

*   **Premium Visual Design**: Sleek aesthetic featuring modern typography (Outfit/Inter), subtle gradients, glassmorphism, responsive grids, and micro-animations.
*   **Massive & Rich Product Catalog**: 
    *   Preloaded database with **50+ products per category** (Electronics, Fashion, Home & Living, Beauty & Personal Care).
    *   Each product features realistic high-resolution images, detailed descriptions, pricing, specifications, user reviews/ratings, and a "similar products" section.
*   **Personalized Search & Recommendations**:
    *   Search behavior is stored and processed to display *Recently Viewed / Searches* personalized recommendations.
    *   Personalized recommendations are securely displayed when signed in; unauthenticated users are prompted with a friendly call-to-action to sign in.
*   **Robust Shopping System**:
    *   Add to Cart / Cart adjustments (quantity selectors, total calculation).
    *   Wishlist toggle state persistence.
    *   Delivery address manager (add/remove addresses directly in user profile).
*   **Interactive Checkout**: Mock UPI checkout flow for seamless checkout simulation without real payment constraints.
*   **Media Hosting**: Built-in support for uploading and serving images via **Cloudinary**.

---

## 🛠️ Tech Stack

### Frontend
*   **React.js** (Vite-powered Single Page App)
*   **Tailwind CSS (v4)** for sleek, modern layouts
*   **Lucide React** for modern, crisp iconography
*   **Axios** for clean API handling with Vite dev proxy configurations
*   **React Router** for clean path routing

### Backend
*   **Node.js & Express** REST API
*   **MongoDB & Mongoose** database management
*   **Socket.io** for real-time capabilities
*   **Cloudinary SDK** for media upload integration
*   **JSON Web Tokens (JWT)** for robust authentication
*   **Dotenv & Cors & Helmet** for configuration and security

---

## 📁 Project Structure

```text
ShopEz/
├── frontend/             # React SPA (Vite + Tailwind CSS v4)
│   ├── src/              # React code (Components, Pages, Hooks, Assets)
│   ├── public/           # Static assets
│   ├── vite.config.js    # Vite configurations (dev proxy included)
│   └── package.json      # Frontend dependencies
│
├── backend/              # Node.js + Express REST API
│   ├── config/           # Database & cloud config connections
│   ├── controllers/      # Route controllers (auth, products, orders, cart)
│   ├── models/           # Mongoose schemas (User, Product, Order, Address)
│   ├── routes/           # API router entrypoints
│   ├── seed.js           # Full catalog seeder (creates 200+ products in Atlas)
│   ├── server.js         # Express app bootstrap & Socket.io init
│   └── package.json      # Backend dependencies
└── README.md             # This documentation
```

---

## 🚀 Getting Started

### Prerequisites
1.  **Node.js** (v16+ recommended)
2.  **MongoDB Atlas URI** (A cloud database instance)
3.  **Cloudinary Account** (For image/media hosting)

---

### Step 1: Clone and Prepare Environment

```bash
git clone https://github.com/jashvithak18/ShopEz.git
cd ShopEz
```

#### Backend Environment Variables
Create a file named `.env` in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smartbridgedb?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=dnjw2ejsv
CLOUDINARY_API_KEY=729236642757222
CLOUDINARY_API_SECRET=0DjiShhMuuMrstLXSajVdkquSyc

# Client URL (For CORS whitelist)
CLIENT_URL=http://localhost:5173
```

#### Frontend Environment Variables
Create a file named `.env` in the `frontend/` directory:

```env
# Local development — leave empty so the Vite dev proxy handles API routing
VITE_API_URL=
```

---

### Step 2: Seed the Database

Before starting the application, populate MongoDB with the pre-packaged catalog of over 200 items:

```bash
cd backend
npm install
node seed.js
```
*(Ensure your network/database connection is active. The database setup includes custom ratings, reviews, specifications, and images.)*

---

### Step 3: Run the Services

#### Start Backend
```bash
# In backend/ directory
npm run dev   # or: node server.js
```
The server will boot on `http://localhost:5000` with active MongoDB connections.

#### Start Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. The Vite development server proxy redirects all `/api/*` calls directly to the local backend port `5000`.

---

## 🌐 Deployment Instructions

When deploying to hosting environments, configure the following:

### 1. Backend (e.g., Render, Heroku)
*   **Root Directory**: `backend`
*   **Build Command**: `npm install`
*   **Start Command**: `node server.js`
*   **Environment Variables**:
    *   Set all variables from your local `backend/.env` file.
    *   Ensure `NODE_ENV=production` is set.
    *   Set `CLIENT_URL` to your production frontend URL (e.g., `https://shopez.vercel.app`).

### 2. Frontend (e.g., Vercel, Netlify)
*   **Root Directory**: `frontend`
*   **Build Command**: `npm run build`
*   **Output Directory**: `dist`
*   **Environment Variables**:
    *   Set `VITE_API_URL` to your live deployed backend URL (e.g., `https://shopez-api.onrender.com`).
