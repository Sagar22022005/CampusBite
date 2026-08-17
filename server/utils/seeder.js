import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Rating from '../models/Rating.js';
import Complaint from '../models/Complaint.js';
import Settlement from '../models/Settlement.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusbite';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Shop.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Rating.deleteMany();
    await Complaint.deleteMany();
    await Settlement.deleteMany();

    console.log('🧹 Cleaned existing database collections');

    // 1. Create Users
    const admin = await User.create({
      name: 'Campus Admin',
      email: 'admin@iiti.ac.in',
      phone: '+91 9876543210',
      password: 'password123',
      role: 'admin',
      status: 'approved',
      hostel: 'Takshashila Complex',
      roomNumber: 'Admin-01',
    });

    const student = await User.create({
      name: 'Aman Sharma',
      email: 'student@iiti.ac.in',
      phone: '+91 9123456780',
      password: 'password123',
      role: 'customer',
      status: 'approved',
      hostel: 'APJ',
      roomNumber: 'A-203',
    });

    const student2 = await User.create({
      name: 'Priya Verma',
      email: 'priya@iiti.ac.in',
      phone: '+91 9234567891',
      password: 'password123',
      role: 'customer',
      status: 'approved',
      hostel: 'CVR',
      roomNumber: 'B-104',
    });

    const shopOwner1 = await User.create({
      name: 'Ramesh (APJ Canteen)',
      email: 'shop@iiti.ac.in', // Default demo shop login
      phone: '+91 9345678902',
      password: 'password123',
      role: 'shop_owner',
      status: 'approved',
      hostel: 'APJ',
      roomNumber: 'Shop-1',
    });

    const shopOwner2 = await User.create({
      name: 'Suresh (VSB Food Court)',
      email: 'vsb.owner@iiti.ac.in',
      phone: '+91 9456789013',
      password: 'password123',
      role: 'shop_owner',
      status: 'approved',
      hostel: 'VSB',
      roomNumber: 'FoodCourt-2',
    });

    const shopOwner3 = await User.create({
      name: 'Anil (Campus Grocery Mart)',
      email: 'mart.owner@iiti.ac.in',
      phone: '+91 9567890124',
      password: 'password123',
      role: 'shop_owner',
      status: 'approved',
      hostel: 'LRC',
      roomNumber: 'Market-1',
    });

    const shopOwner4 = await User.create({
      name: 'Mohan (Fresh Fruits Corner)',
      email: 'fruits.owner@iiti.ac.in',
      phone: '+91 9678901235',
      password: 'password123',
      role: 'shop_owner',
      status: 'approved',
      hostel: 'Sports Complex',
      roomNumber: 'FruitStall-1',
    });

    const pendingShopOwner = await User.create({
      name: 'Vikram Joshi (Chai & Maggi Point)',
      email: 'newvendor@iiti.ac.in',
      phone: '+91 9789012346',
      password: 'password123',
      role: 'shop_owner',
      status: 'pending', // Pending approval test
      hostel: 'HJB',
      roomNumber: 'Kiosk-3',
    });

    const deliveryPartner1 = await User.create({
      name: 'Rahul Kumar',
      email: 'delivery@iiti.ac.in', // Default demo delivery login
      phone: '+91 9890123457',
      password: 'password123',
      role: 'delivery_partner',
      status: 'approved',
      hostel: 'DA',
      roomNumber: 'R-12',
    });

    const pendingDeliveryPartner = await User.create({
      name: 'Karan Singh',
      email: 'newrider@iiti.ac.in',
      phone: '+91 9901234568',
      password: 'password123',
      role: 'delivery_partner',
      status: 'pending', // Pending approval test
      hostel: 'JC Bose',
      roomNumber: 'R-45',
    });

    console.log('👤 Users created successfully');

    // 2. Create Shops
    const shop1 = await Shop.create({
      owner: shopOwner1._id,
      name: 'APJ Canteen',
      category: 'Food',
      description: 'Hot authentic meals, biryani, burgers, and student special combos.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      imageType: 'url',
      isOpen: true,
      rating: 4.8,
      numRatings: 18,
      location: 'Near APJ Hostel Block A',
    });

    const shop2 = await Shop.create({
      owner: shopOwner2._id,
      name: 'VSB Food Court',
      category: 'Food',
      description: 'Delicious pizzas, rolls, Chinese bowls, and freshly brewed coffees.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      imageType: 'url',
      isOpen: true,
      rating: 4.5,
      numRatings: 12,
      location: 'VSB Central Ground',
    });

    const shop3 = await Shop.create({
      owner: shopOwner3._id,
      name: 'Campus Grocery Mart',
      category: 'Groceries',
      description: 'Daily hostel essentials, dairy, snacks, packaged food, and stationery.',
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
      imageType: 'url',
      isOpen: true,
      rating: 4.7,
      numRatings: 9,
      location: 'Near LRC Complex',
    });

    const shop4 = await Shop.create({
      owner: shopOwner4._id,
      name: 'Fresh Fruits Corner',
      category: 'Fruits',
      description: 'Farm-fresh seasonal fruits, natural juices, and healthy fruit platters.',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
      imageType: 'url',
      isOpen: true,
      rating: 4.9,
      numRatings: 15,
      location: 'Near Sports Complex Ground',
    });

    console.log('🏪 Shops created successfully');

    // 3. Create Products
    const productsData = [
      // APJ Canteen (Food)
      {
        shop: shop1._id,
        name: 'Special Chicken Biryani',
        category: 'Food',
        price: 180,
        stock: 25,
        description: 'Aromatic basmati rice cooked with succulent spiced chicken and boiled egg.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      },
      {
        shop: shop1._id,
        name: 'Paneer Butter Masala Meal',
        category: 'Food',
        price: 150,
        stock: 20,
        description: 'Rich cottage cheese gravy served with 3 butter rotis and steamed rice.',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
      },
      {
        shop: shop1._id,
        name: 'Crispy Veg Burger',
        category: 'Food',
        price: 90,
        stock: 30,
        description: 'Golden fried potato and herb patty with fresh lettuce, mayo and melted cheese.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      },
      {
        shop: shop1._id,
        name: 'Cold Coffee with Ice Cream',
        category: 'Food',
        price: 70,
        stock: 40,
        description: 'Thick blended espresso cold coffee topped with vanilla scoop and chocolate drizzle.',
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
      },
      {
        shop: shop1._id,
        name: 'Butter Maggi Double Masala',
        category: 'Food',
        price: 50,
        stock: 50,
        description: 'Midnight classic campus maggi with veggies and extra amul butter.',
        image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
      },

      // VSB Food Court (Food)
      {
        shop: shop2._id,
        name: 'Farmhouse Pizza 8"',
        category: 'Food',
        price: 220,
        stock: 15,
        description: 'Loaded with capsicum, onion, mushrooms, golden corn, and mozzarella.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      },
      {
        shop: shop2._id,
        name: 'Peri Peri Chicken Roll',
        category: 'Food',
        price: 130,
        stock: 20,
        description: 'Spicy grilled chicken wrapped in a crisp flaky paratha with mint chutney.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      },
      {
        shop: shop2._id,
        name: 'Veg Hakka Noodles',
        category: 'Food',
        price: 110,
        stock: 18,
        description: 'Wok tossed noodles with crunchy julienned vegetables and soy chili sauce.',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
      },

      // Campus Grocery Mart (Groceries)
      {
        shop: shop3._id,
        name: 'Amul Taaza Milk 500ml',
        category: 'Groceries',
        price: 28,
        stock: 50,
        description: 'Homogenised toned milk pouch, rich in calcium and protein.',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
      },
      {
        shop: shop3._id,
        name: 'Basmati Rice 1kg',
        category: 'Groceries',
        price: 110,
        stock: 30,
        description: 'Premium long grain aged aromatic basmati rice.',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      },
      {
        shop: shop3._id,
        name: 'Fortune Sunflower Oil 1L',
        category: 'Groceries',
        price: 145,
        stock: 20,
        description: 'Refined sunflower cooking oil for healthy daily cooking.',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
      },
      {
        shop: shop3._id,
        name: 'Oreo Chocolate Biscuits 120g',
        category: 'Groceries',
        price: 35,
        stock: 45,
        description: 'Crunchy chocolate sandwich cookies with smooth vanilla creme.',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
      },
      {
        shop: shop3._id,
        name: 'Lays Magic Masala Chips 50g',
        category: 'Groceries',
        price: 20,
        stock: 60,
        description: 'Spicy ridged potato chips seasoned with Indian spices.',
        image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
      },

      // Fresh Fruits Corner (Fruits)
      {
        shop: shop4._id,
        name: 'Fresh Shimla Apples (1kg)',
        category: 'Fruits',
        price: 160,
        stock: 20,
        description: 'Crisp, sweet, and handpicked red apples rich in dietary fiber.',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
      },
      {
        shop: shop4._id,
        name: 'Robusta Bananas (1 Dozen)',
        category: 'Fruits',
        price: 60,
        stock: 35,
        description: 'Naturally ripened nutrient-dense potassium rich fresh bananas.',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
      },
      {
        shop: shop4._id,
        name: 'Alphonso / Kesar Mangoes (1kg)',
        category: 'Fruits',
        price: 240,
        stock: 15,
        description: 'Sweet, juicy, king of fruits freshly harvested.',
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
      },
      {
        shop: shop4._id,
        name: 'Nagpur Oranges (1kg)',
        category: 'Fruits',
        price: 90,
        stock: 25,
        description: 'Citrusy juicy sweet oranges packed with Vitamin C.',
        image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
      },
    ];

    const insertedProducts = await Product.insertMany(productsData);
    console.log(`📦 ${insertedProducts.length} Products created successfully`);

    // 4. Create Sample Orders
    const order1 = await Order.create({
      customer: student._id,
      shop: shop1._id,
      deliveryPartner: deliveryPartner1._id,
      items: [
        {
          product: insertedProducts[0]._id,
          name: insertedProducts[0].name,
          price: insertedProducts[0].price,
          quantity: 2,
          image: insertedProducts[0].image,
        },
        {
          product: insertedProducts[3]._id,
          name: insertedProducts[3].name,
          price: insertedProducts[3].price,
          quantity: 1,
          image: insertedProducts[3].image,
        },
      ],
      subtotal: 430,
      deliveryFee: 50,
      total: 480,
      deliveryAddress: {
        name: 'Aman Sharma',
        phone: '+91 9123456780',
        hostel: 'APJ',
        roomNumber: 'A-203',
      },
      paymentStatus: 'Paid',
      status: 'Delivered',
      isRated: true,
      isSettledShop: false,
      isSettledDelivery: false,
    });

    const order2 = await Order.create({
      customer: student2._id,
      shop: shop1._id,
      deliveryPartner: deliveryPartner1._id,
      items: [
        {
          product: insertedProducts[2]._id,
          name: insertedProducts[2].name,
          price: insertedProducts[2].price,
          quantity: 1,
          image: insertedProducts[2].image,
        },
      ],
      subtotal: 90,
      deliveryFee: 50,
      total: 140,
      deliveryAddress: {
        name: 'Priya Verma',
        phone: '+91 9234567891',
        hostel: 'CVR',
        roomNumber: 'B-104',
      },
      paymentStatus: 'Paid',
      status: 'Preparing',
      isRated: false,
    });

    const order3 = await Order.create({
      customer: student._id,
      shop: shop4._id,
      deliveryPartner: null, // Available for pickup by delivery partner
      items: [
        {
          product: insertedProducts[13]._id,
          name: insertedProducts[13].name,
          price: insertedProducts[13].price,
          quantity: 1,
          image: insertedProducts[13].image,
        },
        {
          product: insertedProducts[14]._id,
          name: insertedProducts[14].name,
          price: insertedProducts[14].price,
          quantity: 1,
          image: insertedProducts[14].image,
        },
      ],
      subtotal: 220,
      deliveryFee: 50,
      total: 270,
      deliveryAddress: {
        name: 'Aman Sharma',
        phone: '+91 9123456780',
        hostel: 'APJ',
        roomNumber: 'A-203',
      },
      paymentStatus: 'Paid',
      status: 'Ready',
      isRated: false,
    });

    console.log('📋 Sample orders created');

    // 5. Create Sample Rating
    await Rating.create({
      shop: shop1._id,
      customer: student._id,
      order: order1._id,
      rating: 5,
      review: 'Biryani was piping hot and arrived at APJ hostel in just 15 minutes! Super fast delivery.',
    });

    // 6. Create Sample Complaints
    await Complaint.create({
      customer: student._id,
      target: 'shop_owner',
      shop: shop1._id,
      order: order1._id,
      subject: 'Missing extra raita packet',
      message: 'I requested extra spicy raita in the notes, but it was not included in the bag.',
      status: 'Resolved',
      response: 'Apologies for the miss! We have noted this and added a complimentary drink to your next order.',
      resolvedAt: new Date(),
    });

    await Complaint.create({
      customer: student2._id,
      target: 'admin',
      subject: 'Night delivery request for CVR',
      message: 'Could we please extend delivery timings at CVR hostel till 2:00 AM on weekends during exam weeks?',
      status: 'Pending',
    });

    console.log('⭐ Ratings and 🆘 Complaints seeded successfully');

    console.log('\n=============================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log('=============================================');
    console.log('Demo Credentials for All 4 Roles:');
    console.log('👑 Admin:            admin@iiti.ac.in      | password: password123');
    console.log('👨🎓 Customer:         student@iiti.ac.in    | password: password123');
    console.log('🏪 Shop Owner:       shop@iiti.ac.in       | password: password123 (APJ Canteen)');
    console.log('🚴 Delivery Partner: delivery@iiti.ac.in   | password: password123');
    console.log('⏳ Pending Vendor:   newvendor@iiti.ac.in  | password: password123');
    console.log('⏳ Pending Rider:    newrider@iiti.ac.in   | password: password123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedData();
