#  CampusBite — IIT Indore Campus Food, Grocery & Fruit Delivery Platform

<p align="center">
  <img src="https://img.shields.io/badge/Stack-MERN-orange.svg?style=for-the-badge&logo=mongodb" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/Node.js-Express-green.svg?style=for-the-badge&logo=node.js" alt="Node.js Express" />
  <img src="https://img.shields.io/badge/TailwindCSS-Modern_UI-38B2AC.svg?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Database-MongoDB_Atlas-47A248.svg?style=for-the-badge&logo=mongodb" alt="MongoDB Atlas" />
  <img src="https://img.shields.io/badge/Security-JWT_%26_Bcrypt-red.svg?style=for-the-badge&logo=json-web-tokens" alt="JWT Auth" />
</p>

---

## 📌 Overview

**CampusBite** is a full-featured, multi-tenant campus delivery web platform designed specifically for college campuses (built for **IIT Indore**). It connects on-campus canteens, grocery stores, juice corners, and fruit stalls directly with students staying across different campus hostels, backed by peer student delivery partners and an institute administrator.

---

## Key Features & Role Portals

### 👨‍🎓 1. Customer (Student) Portal
- **Institute Authentication**: Restricted to `@iiti.ac.in` domain emails with secure JWT & bcrypt hashing.
- **Smart Campus Browsing**: Filter shops by categories (**Food & Canteen**, **Groceries & Essentials**, **Fresh Fruits & Juices**).
- **Interactive Menu & Cart**: Real-time product search, instant stock verification, veg/non-veg tags, and single-shop cart enforcement.
- **Campus Delivery Checkout**: Select specific campus hostels (**CVR, VSB, APJ, DA, HJB, LRC, Sports Complex, Takshashila**) and room numbers. Standard ₹50 delivery fee.
- **Dummy Payment Gateway**: Instant payment simulation with automated inventory stock deduction.
- **Live Order Timeline Tracking**: Visual 6-step progress stepper (`Order Placed` $\rightarrow$ `Shop Accepted` $\rightarrow$ `Preparing` $\rightarrow$ `Ready` $\rightarrow$ `Picked Up` $\rightarrow$ `Delivered`).
- **❌ 1-Click Order Cancellation (100% Full Refund)**: Cancel orders freely while in `Pending` state before shop accepts. Restores stock immediately and queues a 100% full money refund for admin settlement.
- **⭐ Post-Delivery Reviews**: Submit 1–5 star ratings and feedback for canteens.
- **🆘 Dual-Target Complaint System**: Report issues directly to the specific **Shop Owner** (for food taste, packaging, missing items) or escalate to **Campus Admin** (for billing disputes, platform bugs).

---

### 🏪 2. Shop Owner (Canteen / Store) Portal
- **Kitchen Order Management**: Real-time incoming order dashboard with status tracking.
- **Status Workflow**: Accept orders, update kitchen preparation stages (`Preparing` $\rightarrow$ `Ready for Pickup`), or Reject with reason (automatically refunds customer).
- **Menu & Product Management**: Add, edit, delete dishes, toggle availability in 1 click, upload dish images, and manage real-time inventory quantities.
- **Customer Feedback & Complaints**: Dedicated inbox to resolve incoming customer complaints with custom resolution messages.
- **🆘 Admin Ticket Desk**: Raise support tickets directly to the institute administrator for canteen maintenance or fee disputes.
- **Revenue & Sales Analytics**: Track total gross sales, completed orders, and pending end-of-day bank payouts.

---

### 🚴 3. Delivery Partner (Campus Rider) Portal
- **Order Pool with Privacy Protection**: Browse ready campus orders. Student phone number and room number are masked until the rider claims the order.
- **Atomic Order Claiming**: Prevents race conditions—only one rider can claim an order.
- **Active Trip Dashboard**: Direct 1-click speed dial to call the student and canteen, view precise hostel drop-off instructions, and mark `Picked Up` $\rightarrow$ `Delivered`.
- **Rider Earnings**: Earn a flat **₹50 delivery fee** per delivered trip, tracked in the earnings ledger.
- **🆘 Rider Help Desk**: Dedicated ticket category system to report hostel security gate access issues, unreachable students, or canteen delays directly to Admin.

---

### 👑 4. Institute Administrator Portal
- **Role Approval Gate**: Approve or reject newly registered canteen owners and delivery riders before they can access operational dashboards.
- **Campus Analytics Dashboard**: Live metrics for total campus orders, platform revenue, active canteens, riders, registered students, and open disputes.
- **Shop & Order Overseer**: Monitor all campus canteens and live orders campus-wide.
- **Dispute Resolution Center**: Review and resolve complaints from students, shops, and delivery partners with official administrative remarks.
- **💰 Financial Settlements & Customer Refunds**:
  - **Shop Payouts**: Settle daily food earnings to campus canteens.
  - **Rider Fees**: Disburse accumulated ₹50 delivery fees to student partners.
  - **Customer Cancellation Refunds**: 1-click disbursement of 100% full money refunds for customer-cancelled orders.
  - **Audit Ledger**: Comprehensive history log of all past financial settlements.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide React Icons |
| **Styling** | Vanilla CSS + Tailwind CSS (Custom HSL Palettes & Glassmorphism) |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB Atlas Cloud Database, Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt.js password hashing |
| **Testing** | Custom 26-step automated end-to-end integration test suite |
| **Deployment** | Vercel (Frontend SPA) + Render (Backend REST API) |

---

## 🗂️ Project Structure

```text
CampusBite/
├── client/                     # Vite React Frontend
│   ├── public/                 # Static assets & Netlify _redirects
│   ├── src/
│   │   ├── components/         # Navbar, Footer, OrderTracker, StatusBadge, Modal, StarRating
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── pages/
│   │   │   ├── auth/           # Login.jsx, Signup.jsx
│   │   │   ├── customer/       # Home, CategoryShops, ShopDetail, Cart, Checkout, TrackOrder, Help
│   │   │   ├── shop/           # ShopDashboard, MyShop, ManageProducts, ShopOrders, Complaints
│   │   │   ├── delivery/       # DeliveryDashboard, AvailableOrders, ActiveDelivery, RiderHelp
│   │   │   └── admin/          # AdminDashboard, UserApprovals, ManageShops, Settlements, Complaints
│   │   ├── services/           # api.js (Axios instance with JWT interceptors)
│   │   ├── App.jsx             # Route definitions & Role-based ProtectedRoutes
│   │   └── main.jsx            # React root entry
│   ├── tailwind.config.js      # Custom theme tokens & design system
│   ├── vercel.json             # Vercel SPA rewrite rules
│   └── vite.config.js          # Vite config with dev proxy
│
├── server/                     # Node.js Express Backend
│   ├── config/                 # db.js (MongoDB Atlas connection)
│   ├── controllers/            # 9 Modular Controller handlers
│   ├── middleware/             # authMiddleware.js, roleMiddleware.js, uploadMiddleware.js
│   ├── models/                 # User, Shop, Product, Order, Rating, Complaint, Settlement
│   ├── routes/                 # 9 Express REST route modules
│   ├── utils/
│   │   ├── seeder.js           # Database seeder with sample canteens & menus
│   │   └── testSuite.js        # 26 automated integration tests
│   ├── .env                    # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── package.json            # Backend dependencies & scripts
│   └── server.js               # Express app entry point
│
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
