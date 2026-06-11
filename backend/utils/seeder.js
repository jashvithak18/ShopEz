import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.js';
import Seller from '../models/seller.js';
import Product from '../models/product.js';
import Category from '../models/category.js';
import Coupon from '../models/coupon.js';
import Cart from '../models/cart.js';
import Wishlist from '../models/wishlist.js';
import Order from '../models/order.js';
import Review from '../models/review.js';
import Address from '../models/address.js';
dotenv.config();
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopez');
const seedData = async () => {
  try {
    await User.deleteMany();
    await Seller.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Address.deleteMany();
    console.log('Database cleared.');
    const adminUser = await User.create({
      name: 'ShopEZ Admin',
      email: 'admin@shopez.com',
      password: 'password123',
      role: 'admin',
      isVerified: true
    });
    const sellerUser = await User.create({
      name: 'ShopEZ Seller',
      email: 'seller@shopez.com',
      password: 'password123',
      role: 'seller',
      isVerified: true
    });
    const customerUser = await User.create({
      name: 'John Doe',
      email: 'customer@shopez.com',
      password: 'password123',
      role: 'customer',
      isVerified: true
    });
    await Cart.create({ user: customerUser._id, items: [] });
    await Wishlist.create({ user: customerUser._id, products: [] });
    console.log('Users created.');
    const seller = await Seller.create({
      user: sellerUser._id,
      storeName: 'AeroTech Official',
      description: 'Futuristic designs and technology for a modern life.',
      isVerified: true,
      rating: 4.8
    });
    console.log('Seller profile created.');
    const electronics = await Category.create({ name: 'Electronics', slug: 'electronics' });
    const apparel = await Category.create({ name: 'Apparel', slug: 'apparel' });
    const lifestyle = await Category.create({ name: 'Lifestyle', slug: 'lifestyle' });
    const laptops = await Category.create({ name: 'Laptops', slug: 'laptops', parent: electronics._id });
    const phones = await Category.create({ name: 'Phones', slug: 'phones', parent: electronics._id });
    const mens = await Category.create({ name: 'Mens Wear', slug: 'mens-wear', parent: apparel._id });
    const womens = await Category.create({ name: 'Womens Wear', slug: 'womens-wear', parent: apparel._id });
    console.log('Categories created.');
    await Coupon.create({
      code: 'SHOPEZ10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 4999,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    await Coupon.create({
      code: 'WELCOME50',
      discountType: 'flat',
      discountValue: 1500,
      minOrderValue: 9999,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    console.log('Coupons created.');
    const products = [
      {
        seller: seller._id,
        name: 'AeroBook Pro 14',
        description: 'An ultra-slim, metal-body premium laptop powered by the latest octa-core processor. Designed for creators, developers, and minimalist designers who demand power on the go.',
        basePrice: 99999,
        category: electronics._id,
        subcategory: laptops._id,
        featured: true,
        trending: true,
        bestSeller: true,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800'
        ],
        variants: [
          { color: 'Space Gray', size: '16GB RAM / 512GB SSD', price: 99999, stock: 15 },
          { color: 'Silver', size: '16GB RAM / 1TB SSD', price: 119999, stock: 10 }
        ],
        specifications: [
          { name: 'Processor', value: 'Aero-M3 Octa-Core' },
          { name: 'Battery', value: 'Up to 18 hours' },
          { name: 'Display', value: '14.2" Liquid Retina XDR' }
        ]
      },
      {
        seller: seller._id,
        name: 'AeroPhone Ultra 15',
        description: 'Redefining smartphones with a full titanium chassis, dynamic frame refresh rates, and a professional-grade triple camera array capturing cinema-quality details.',
        basePrice: 69999,
        category: electronics._id,
        subcategory: phones._id,
        featured: true,
        newArrival: true,
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800'
        ],
        variants: [
          { color: 'Titanium Black', size: '256GB', price: 69999, stock: 30 },
          { color: 'Titanium Blue', size: '512GB', price: 84999, stock: 20 }
        ],
        specifications: [
          { name: 'Camera', value: '108MP + 48MP + 12MP' },
          { name: 'OS', value: 'AeroOS 18' },
          { name: 'Weight', value: '187g' }
        ]
      },
      {
        seller: seller._id,
        name: 'AeroPod Air Pro',
        description: 'Immersive sound experience with active spatial audio cancellation. Sound transparency modes let you hear the world with Nike-level dynamic adjustments.',
        basePrice: 19999,
        category: electronics._id,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
        ],
        variants: [
          { color: 'Pure White', size: 'Standard', price: 19999, stock: 50 }
        ],
        specifications: [
          { name: 'Battery Life', value: 'Up to 30 hours with case' },
          { name: 'Connectivity', value: 'Bluetooth 5.3' }
        ]
      },
      {
        seller: seller._id,
        name: 'Prime Cotton Tech Parka',
        description: 'Waterproof, breathable modern technical outerwear featuring multi-pocket utility adjustments and sleek structural lines for urban exploration.',
        basePrice: 9999,
        category: apparel._id,
        subcategory: mens._id,
        trending: true,
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'
        ],
        variants: [
          { color: 'Midnight Black', size: 'M', price: 9999, stock: 25 },
          { color: 'Midnight Black', size: 'L', price: 9999, stock: 25 },
          { color: 'Sand Beige', size: 'M', price: 9999, stock: 15 }
        ],
        specifications: [
          { name: 'Material', value: 'Gore-Tex Recycled Cotton Blend' },
          { name: 'Fit', value: 'Relaxed Technical Fit' }
        ]
      },
      {
        seller: seller._id,
        name: 'Studio Wool Trench Coat',
        description: 'Tailored wool blend coat for timeless elegance. Double-breasted layout with smart collar adjustments.',
        basePrice: 14999,
        category: apparel._id,
        subcategory: womens._id,
        bestSeller: true,
        images: [
          'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=800'
        ],
        variants: [
          { color: 'Camel Brown', size: 'S', price: 14999, stock: 10 },
          { color: 'Camel Brown', size: 'M', price: 14999, stock: 15 }
        ],
        specifications: [
          { name: 'Material', value: '80% Merino Wool, 20% Nylon' },
          { name: 'Care', value: 'Dry Clean Only' }
        ]
      }
    ];
    await Product.create(products);
    console.log('Products seeded successfully.');
    const seededProducts = await Product.find();
    for (const prod of seededProducts) {
      await Review.create({
        product: prod._id,
        user: customerUser._id,
        rating: 5,
        comment: 'Absolutely brilliant! The craftsmanship is top tier. This represents the premium brand aesthetic ShopEZ promised.'
      });
      prod.rating = 5.0;
      prod.numReviews = 1;
      await prod.save();
    }
    console.log('Mock reviews seeded.');
    console.log('All seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};
seedData();
