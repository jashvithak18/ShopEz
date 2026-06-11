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

