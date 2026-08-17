#  CampusBite — IIT Indore Campus Food, Grocery & Fruit Delivery Platform

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
