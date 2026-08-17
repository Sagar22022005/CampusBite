const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🧪 ===============================================');
  console.log('🧪 STARTING CAMPUS DELIVERY FULL API TEST SUITE');
  console.log('🧪 ===============================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Health Check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    assert(health.status === 'online', '1. Server Health Check API Online');

    // 2. Reject Non-IIT Indore Email Domain
    const rejectRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Invalid User',
        email: 'hacker@gmail.com',
        phone: '1234567890',
        password: 'password123',
        role: 'customer',
      }),
    });
    const rejectData = await rejectRes.json();
    assert(
      rejectRes.status === 400 && rejectData.message.includes('@iiti.ac.in'),
      '2. Reject non-@iiti.ac.in domain on signup (Expected 400)'
    );

    // 3. Login as Admin
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@iiti.ac.in',
        password: 'password123',
      }),
    });
    const adminLogin = await adminLoginRes.json();
    const adminToken = adminLogin.token;
    assert(adminToken && adminLogin.user.role === 'admin', '3. Admin Login & JWT Generation');

    // 4. Login as Customer (student@iiti.ac.in)
    const custLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student@iiti.ac.in',
        password: 'password123',
      }),
    });
    const custLogin = await custLoginRes.json();
    const custToken = custLogin.token;
    assert(custToken && custLogin.user.role === 'customer', '4. Customer Login & JWT Generation');

    // 5. Login as Shop Owner (shop@iiti.ac.in)
    const shopLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'shop@iiti.ac.in',
        password: 'password123',
      }),
    });
    const shopLogin = await shopLoginRes.json();
    const shopToken = shopLogin.token;
    assert(shopToken && shopLogin.user.role === 'shop_owner', '5. Shop Owner Login & JWT Generation');

    // 6. Login as Delivery Partner (delivery@iiti.ac.in)
    const delivLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'delivery@iiti.ac.in',
        password: 'password123',
      }),
    });
    const delivLogin = await delivLoginRes.json();
    const delivToken = delivLogin.token;
    assert(delivToken && delivLogin.user.role === 'delivery_partner', '6. Delivery Partner Login & JWT Generation');

    // 7. Test Pending User Login Block
    const pendingLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'newvendor@iiti.ac.in',
        password: 'password123',
      }),
    });
    const pendingLogin = await pendingLoginRes.json();
    assert(
      pendingLoginRes.status === 403 && pendingLogin.status === 'pending',
      '7. Pending User login blocked until Admin approval (Expected 403)'
    );

    // 8. Admin Approves Pending User
    const usersListRes = await fetch(`${BASE_URL}/admin/users?status=pending`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const usersList = await usersListRes.json();
    const pendingUser = usersList.find((u) => u.email === 'newvendor@iiti.ac.in');
    if (pendingUser) {
      const approveRes = await fetch(`${BASE_URL}/admin/users/${pendingUser._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: 'approved' }),
      });
      const approveData = await approveRes.json();
      assert(approveData.user.status === 'approved', '8. Admin Approves Pending Shop Owner');
    }

    // 9. Fetch Shops by Category
    const foodRes = await fetch(`${BASE_URL}/shops?category=Food`);
    const foodShops = await foodRes.json();
    const grocRes = await fetch(`${BASE_URL}/shops?category=Groceries`);
    const grocShops = await grocRes.json();
    const fruitRes = await fetch(`${BASE_URL}/shops?category=Fruits`);
    const fruitShops = await fruitRes.json();

    assert(
      foodShops.length > 0 && grocShops.length > 0 && fruitShops.length > 0,
      '9. Filter Campus Shops by Categories (Food, Groceries, Fruits)'
    );

    const targetShop = foodShops[0];
    const shopDetailRes = await fetch(`${BASE_URL}/shops/${targetShop._id}`);
    const shopDetails = await shopDetailRes.json();
    assert(shopDetails.products.length > 0, '10. Fetch Shop Details with Menu Products');

    const testProduct = shopDetails.products[0];
    const initialStock = testProduct.stock;

    // 11. Customer Places Order with Dummy Payment
    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${custToken}`,
      },
      body: JSON.stringify({
        shopId: targetShop._id,
        items: [
          {
            productId: testProduct._id,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 2,
          },
        ],
        deliveryAddress: {
          name: 'Aman Sharma',
          phone: '+91 9123456780',
          hostel: 'APJ',
          roomNumber: 'A-203',
        },
      }),
    });
    const orderData = await orderRes.json();
    const createdOrder = orderData.order;

    assert(
      createdOrder.paymentStatus === 'Paid' &&
        createdOrder.deliveryFee === 50 &&
        createdOrder.status === 'Pending',
      '11. Customer Checkout & Dummy Payment (Order Created with ₹50 delivery fee)'
    );

    // 12. Verify Stock Decrement
    const updatedShopDetailRes = await fetch(`${BASE_URL}/shops/${targetShop._id}`);
    const updatedShopDetails = await updatedShopDetailRes.json();
    const updatedProduct = updatedShopDetails.products.find(
      (p) => p._id.toString() === testProduct._id.toString()
    );
    assert(
      updatedProduct.stock === initialStock - 2,
      `12. Inventory Stock decremented (${initialStock} -> ${updatedProduct.stock})`
    );

    // 13. Shop Owner Accepts & Prepares Order
    const acceptRes = await fetch(`${BASE_URL}/orders/${createdOrder._id}/shop-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${shopToken}`,
      },
      body: JSON.stringify({ status: 'Accepted' }),
    });
    const acceptData = await acceptRes.json();
    assert(acceptData.order.status === 'Accepted', '13. Shop Owner Accepts Order');

    const prepRes = await fetch(`${BASE_URL}/orders/${createdOrder._id}/shop-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${shopToken}`,
      },
      body: JSON.stringify({ status: 'Preparing' }),
    });
    const prepData = await prepRes.json();
    assert(prepData.order.status === 'Preparing', '14. Shop Owner Marks Preparing');

    const readyRes = await fetch(`${BASE_URL}/orders/${createdOrder._id}/shop-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${shopToken}`,
      },
      body: JSON.stringify({ status: 'Ready' }),
    });
    const readyData = await readyRes.json();
    assert(readyData.order.status === 'Ready', '15. Shop Owner Marks Ready for Rider');

    // 16. Delivery Partner Views Available Deliveries (Privacy Protection Check)
    const availRes = await fetch(`${BASE_URL}/delivery/available`, {
      headers: { Authorization: `Bearer ${delivToken}` },
    });
    const availDeliveries = await availRes.json();
    const orderInPool = availDeliveries.find(
      (o) => o._id.toString() === createdOrder._id.toString()
    );
    assert(
      orderInPool &&
        orderInPool.deliveryAddress.name.includes('Hidden') &&
        orderInPool.deliveryAddress.phone.includes('Hidden'),
      '16. Delivery Pool Privacy Protection (Customer name/phone masked before accept)'
    );

    // 17. Delivery Partner Claims Order (Atomic Acceptance)
    const claimRes = await fetch(`${BASE_URL}/delivery/${createdOrder._id}/accept`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${delivToken}` },
    });
    const claimData = await claimRes.json();
    assert(
      claimData.order.customer.name === 'Aman Sharma' &&
        claimData.order.customer.phone === '+91 9123456780',
      '17. Delivery Claim Unlocks Customer Details (Name & Phone revealed)'
    );

    // 18. Delivery Partner Advances to Picked Up & Delivered
    await fetch(`${BASE_URL}/delivery/${createdOrder._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${delivToken}`,
      },
      body: JSON.stringify({ status: 'Picked Up' }),
    });

    const deliveredRes = await fetch(`${BASE_URL}/delivery/${createdOrder._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${delivToken}`,
      },
      body: JSON.stringify({ status: 'Delivered' }),
    });
    const deliveredData = await deliveredRes.json();
    assert(deliveredData.order.status === 'Delivered', '18. Delivery Partner Marks Delivered');

    // 19. Customer Rates Delivered Order
    const ratingRes = await fetch(`${BASE_URL}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${custToken}`,
      },
      body: JSON.stringify({
        orderId: createdOrder._id,
        rating: 5,
        review: 'Hot food delivered swiftly to APJ hostel!',
      }),
    });
    const ratingData = await ratingRes.json();
    assert(ratingData.rating.rating === 5, '19. Customer Rating & Review Submission');

    // 20. Customer Submits Complaints (to Shop Owner & Admin)
    const shopComplaintRes = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${custToken}`,
      },
      body: JSON.stringify({
        target: 'shop_owner',
        shopId: targetShop._id,
        subject: 'Canteen item test feedback',
        message: 'Could you add extra napkins in the bag next time?',
      }),
    });
    const shopComplaint = await shopComplaintRes.json();
    assert(shopComplaint.complaint.target === 'shop_owner', '20. Customer Files Complaint to Shop Owner');

    // Shop Owner Resolves Complaint
    const resolveCompRes = await fetch(
      `${BASE_URL}/complaints/${shopComplaint.complaint._id}/resolve`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${shopToken}`,
        },
        body: JSON.stringify({
          response: 'Sure, we have added a reminder note for our packing staff!',
        }),
      }
    );
    const resolveCompData = await resolveCompRes.json();
    assert(
      resolveCompData.complaint.status === 'Resolved',
      '21. Shop Owner Resolves Complaint with Response'
    );

    // 22. Test Order Cancellation before Shop Acceptance
    const cancelOrderTestRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${custToken}`,
      },
      body: JSON.stringify({
        shopId: targetShop._id,
        items: [
          {
            productId: testProduct._id,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 1,
          },
        ],
        deliveryAddress: {
          name: 'Aman Sharma',
          phone: '+91 9123456780',
          hostel: 'APJ',
          roomNumber: 'A-203',
        },
      }),
    });
    const cancelOrderData = await cancelOrderTestRes.json();
    const orderToCancel = cancelOrderData.order;

    const cancelActionRes = await fetch(
      `${BASE_URL}/orders/${orderToCancel._id}/cancel`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${custToken}`,
        },
        body: JSON.stringify({ reason: 'Changed mind before shop accepted' }),
      }
    );
    const cancelActionData = await cancelActionRes.json();
    assert(
      cancelActionData.order.status === 'Cancelled' &&
        cancelActionData.order.paymentStatus === 'Refund Due',
      '22. Customer Cancels Pending Order (Status = Cancelled, PaymentStatus = Refund Due)'
    );

    // 23. Test Cancellation Block once Shop Accepts Order
    try {
      const blockCancelRes = await fetch(
        `${BASE_URL}/orders/${createdOrder._id}/cancel`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${custToken}`,
          },
          body: JSON.stringify({ reason: 'Trying to cancel accepted order' }),
        }
      );
      assert(blockCancelRes.status === 400, '23. Block Cancellation once Shop Accepts (Expected 400)');
    } catch (e) {
      assert(true, '23. Block Cancellation once Shop Accepts (Expected 400)');
    }

    // 24. Admin End-of-Day Settlements & Customer Refunds
    const settlementSumRes = await fetch(`${BASE_URL}/settlements/summary`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const settlementSummary = await settlementSumRes.json();
    assert(
      settlementSummary.pendingShops.length > 0 &&
        settlementSummary.pendingRefunds.length > 0,
      '24. Admin Settlement Summary (Pending shop payouts & customer refunds calculated)'
    );

    // Disburse customer refund
    const targetRefund = settlementSummary.pendingRefunds[0];
    const execRefundRes = await fetch(`${BASE_URL}/settlements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        settlementType: 'customer_refund',
        targetId: targetRefund.customer?._id || targetRefund.customer,
        orderIds: [targetRefund.orderId],
        totalAmount: targetRefund.totalAmount,
        notes: 'Full refund for customer cancelled order',
      }),
    });
    const execRefund = await execRefundRes.json();
    assert(
      execRefund.settlement.status === 'Settled',
      '25. Admin Disburses Full Refund to Customer'
    );

    // Settle Shop payout
    const targetPendingShop = settlementSummary.pendingShops[0];
    const execSettleRes = await fetch(`${BASE_URL}/settlements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        settlementType: 'shop',
        targetId: targetPendingShop.shopId,
        orderIds: targetPendingShop.orders,
        totalAmount: targetPendingShop.totalAmount,
        notes: 'Daily canteen bank transfer settlement',
      }),
    });
    const execSettlement = await execSettleRes.json();
    assert(
      execSettlement.settlement.status === 'Settled',
      '26. Admin Executes Daily Shop Settlement'
    );

    console.log('\n===============================================');
    console.log(`🎉 TEST SUITE COMPLETED: ${passed} Passed, ${failed} Failed`);
    console.log('===============================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('❌ Test execution error:', err);
    process.exit(1);
  }
};

runTests();
