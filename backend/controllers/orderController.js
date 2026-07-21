import Razorpay from "razorpay";
import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import { sendEmailInBackground } from "../utils/mailer.js";
import Coupon from "../models/couponModel.js";
import {
  createShiprocketOrder,
  getEstimatedDeliveryDate,
} from "../utils/shiprocket.js";
import {
  calculateTotalWeight,
  calculateEstimatedDate,
} from "../utils/orderHelpers.js";

import {
  computeCouponDiscount,
  consumeWelcomeDiscount,
  validateWelcomeCoupon,
} from "../utils/welcomeDiscount.js";

import { getShiprocketToken } from '../utils/shiprocket.js';
import axios from "axios";


const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const computeOrderAmounts = (items, discount = 0) => {
  const subtotal = (items || []).reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );
  const tax = Math.floor(subtotal * 0.02);
  const amount = Math.max(0, subtotal + tax - (Number(discount) || 0));
  return { subtotal, tax, amount };
};

const resolveOrderDiscount = async ({
  couponCode,
  items,
  userId,
  addressPhone,
}) => {
  if (!couponCode) {
    return { discount: 0, couponCode: "" };
  }

  const coupon = await Coupon.findOne({ couponCode, isActive: true });
  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  if (new Date(coupon.expiryDate) < new Date()) {
    throw new Error("Coupon has expired");
  }

  const subtotal = (items || []).reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );

  if (subtotal < coupon.minPurchaseAmount) {
    throw new Error(`Minimum purchase amount is ₹${coupon.minPurchaseAmount}`);
  }

  if (coupon.isWelcomeCoupon) {
    const welcomeCheck = await validateWelcomeCoupon({
      coupon,
      userId,
      addressPhone,
    });
    if (!welcomeCheck.valid) {
      throw new Error(welcomeCheck.message);
    }
  }

  const discount = computeCouponDiscount(coupon, subtotal);
  return { discount, couponCode, coupon };
};

const formatOrderSummaryHtml = (order) => {
  const { subtotal, tax, amount } = computeOrderAmounts(
    order.items,
    order.discount,
  );
  const orderSubtotal = order.subtotal ?? subtotal;
  const orderTax = order.tax ?? tax;
  const orderAmount = order.amount ?? amount;
  const discount = Number(order.discount) || 0;

  return `
    <p><strong>Subtotal:</strong> ₹${orderSubtotal}</p>
    <p><strong>Tax (2%):</strong> ₹${orderTax}</p>
    ${discount > 0 ? `<p><strong>Discount:</strong> -₹${discount}</p>` : ""}
    ${order.couponCode ? `<p>Coupon Applied: ${order.couponCode}</p>` : ""}
    <p><strong>Total Amount: ₹${orderAmount}</strong></p>
  `;
};

// ---------------- COD Order ----------------
// const placeOrderCOD = async (req, res) => {
//   try {
//     const { userId, items, amount, address, couponCode, discount } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ success: false, message: "No items provided in the order" });
//     }

//     const uniqueOrderId = `COD-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

//     const orderData = {
//       orderid: uniqueOrderId,
//       userId,
//       items,
//       amount,
//       address,
//       paymentMethod: "COD",
//       payment: false,
//       couponCode,
//       discount,
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     res.json({ success: true, message: "Order placed successfully (COD)", orderid: uniqueOrderId });
//   } catch (error) {
//     console.error("Error in placeOrderCOD:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

const sendCODOrderConfirmationEmail = (order) => {
  // Format date helper (dd/mm/yyyy)
  const formatDateDDMMYYYY = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Build delivery message
  let deliveryMessage = 'Your order has been successfully placed and is now being processed.';
  if (order.estimatedDelivery && order.estimatedDelivery.maxDays) {
    const days = order.estimatedDelivery.maxDays;
    const dayLabel = days > 1 ? 'days' : 'day';
    const dateStr = order.estimatedDelivery.estimatedDate
      ? ` (by ${formatDateDDMMYYYY(order.estimatedDelivery.estimatedDate)})`
      : '';
    deliveryMessage = `Your order has been confirmed and is expected to be delivered within ${days} ${dayLabel}${dateStr}.`;
  }

  // Build delivery info block for the email (optional but helpful)
  const deliveryInfoHtml = (order.estimatedDelivery && order.estimatedDelivery.maxDays) ? `
    <div class="delivery-info" style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top:0;">Estimated Delivery</h3>
        <p>
            Expected within ${order.estimatedDelivery.maxDays} day${order.estimatedDelivery.maxDays > 1 ? 's' : ''}
            ${order.estimatedDelivery.estimatedDate ? `(by ${formatDateDDMMYYYY(order.estimatedDelivery.estimatedDate)})` : ''}
        </p>
        ${order.estimatedDelivery.courier ? `<p>Courier: ${order.estimatedDelivery.courier}</p>` : ''}
    </div>
  ` : '';

  sendEmailInBackground({
    to: order.address.email,
    subject: `Order Placed - Order #${order.orderid}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background-color: #10b981;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            color: white;
            margin: 0;
        }
        .content {
            padding: 30px;
        }
        .order-details {
            background-color: #f9fafb;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .product {
            display: flex;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eeeeee;
        }
        .product:last-child {
            border-bottom: none;
        }
        .product-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            margin-right: 15px;
            border-radius: 5px;
        }
        .product-info {
            flex: 1;
        }
        .summary {
            background-color: #ecfdf5;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin-top: 20px;
        }
        .footer {
            background-color: #f3f4f6;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
        .cod-notice {
            background-color: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
        }
        .delivery-info {
            background-color: #f0fdf4;
            border-left: 4px solid #22c55e;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmed</h1>
        </div>
        
        <div class="content">
            <h2>Thank you for your order!</h2>
            <p>Hi ${order.address.fullName},</p>
            <p>${deliveryMessage}</p>
            
            ${deliveryInfoHtml}
            
            <div class="cod-notice">
                <h3>Cash on Delivery</h3>
                <p>Please have the exact amount ready when our delivery agent arrives with your order.</p>
                <p><strong>Amount to be paid: ₹${order.amount}</strong></p>
            </div>
            
            <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${order.orderid}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Payment Method:</strong> Cash on Delivery</p>
                
                <h4>Items Ordered</h4>
                ${order.items
                  .map(
                    (item) => `
                    <div class="product">
                        <img src="${item.image}" alt="${item.name}" class="product-image">
                        <div class="product-info">
                            <p><strong>${item.name}</strong></p>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Price: ₹${item.price}</p>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
                
                <div class="summary">
                    ${formatOrderSummaryHtml(order)}
                </div>
            </div>
            
            <div>
                <h3>Shipping Address</h3>
                <p>
                    ${order.address.fullName} <br>
                    ${order.address.company ? order.address.company + "<br>" : ""}
                    ${order.address.address1}<br>
                    ${order.address.address2 ? order.address.address2 + "<br>" : ""}
                    ${order.address.city}, ${order.address.postalCode}<br>
                    Phone: ${order.address.phone}
                </p>
            </div>
            
            <p>If you have any questions, contact our customer service team at <a href="mailto:enquiry@zayoraa.in">enquiry@zayoraa.in</a>.</p>
            
            <a href="${process.env.FRONTEND_URL}/orders/${order.orderid}" class="button">Track Your Order</a>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <p>123 Business Street, City, Country</p>
        </div>
    </div>
</body>
</html>
      `,
  });
};

const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No items provided in the order" });
    }

    let resolvedDiscount = 0;
    let resolvedCouponCode = "";

    if (couponCode) {
      try {
        const discountResult = await resolveOrderDiscount({
          couponCode,
          items,
          userId,
          addressPhone: address?.phone,
        });
        resolvedDiscount = discountResult.discount;
        resolvedCouponCode = discountResult.couponCode;
      } catch (couponError) {
        return res
          .status(400)
          .json({ success: false, message: couponError.message });
      }
    }

    const { subtotal, tax, amount } = computeOrderAmounts(
      items,
      resolvedDiscount,
    );
    const uniqueOrderId = `COD-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

    const orderData = {
      orderid: uniqueOrderId,
      userId,
      items,
      subtotal,
      tax,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      couponCode: resolvedCouponCode,
      discount: resolvedDiscount,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // --- NEW: Fetch EDD ---
    // --- Fetch EDD for COD order ---
    const eddResult = await getEstimatedDeliveryDate({
      pickupPincode: process.env.SHIPROCKET_PICKUP_PINCODE,
      deliveryPincode: newOrder.address.postalCode,
      weight: calculateTotalWeight(newOrder.items),
      isCod: true,
    });

    console.log("EDD result:", JSON.stringify(eddResult, null, 2));

    if (eddResult && eddResult.couriers && eddResult.couriers.length > 0) {
      let courier = eddResult.couriers[0];
      if (eddResult.recommendedCourierId) {
        const recommended = eddResult.couriers.find(
          (c) => c.courier_company_id === eddResult.recommendedCourierId,
        );
        if (recommended) courier = recommended;
      }

      const days = parseInt(courier.estimated_delivery_days, 10) || 0;
      let estimatedDate = null;
      if (courier.etd) {
        estimatedDate = new Date(courier.etd);
        if (isNaN(estimatedDate.getTime())) estimatedDate = null;
      }

      newOrder.estimatedDelivery = {
        minDays: days,
        maxDays: days,
        courier: courier.courier_name,
        estimatedDate: estimatedDate,
      };
      await newOrder.save();
    }

    // rest the coupon code
    if (resolvedCouponCode && userId) {
      const coupon = await Coupon.findOne({ couponCode: resolvedCouponCode });
      if (coupon?.isWelcomeCoupon) {
        await consumeWelcomeDiscount(userId, resolvedCouponCode);
      }
    }

    sendCODOrderConfirmationEmail(newOrder);

    // Create Shiprocket order (non-blocking)
    // Fire and forget – don't await if you don't want to delay response
    // createShiprocketOrder(newOrder).catch((err) =>
    //   console.error("Async Shiprocket error:", err),
    // );



    // Create Shiprocket order and save IDs
try {
  const shiprocketResponse = await createShiprocketOrder(newOrder);
  if (shiprocketResponse?.order_id) {
    newOrder.shiprocketOrderId = shiprocketResponse.order_id.toString();
    newOrder.shiprocketShipmentId = shiprocketResponse.shipment_id?.toString() || '';
    await newOrder.save();
  }
} catch (err) {
  console.error('Shiprocket order creation failed (non-fatal):', err);
}


    res.json({
      success: true,
      message: "Order placed successfully (COD)",
      orderid: uniqueOrderId,
    });
  } catch (error) {
    console.error("Error in placeOrderCOD:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Function to send COD order confirmation email

// ---------------- Razorpay Order ----------------
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, address, couponCode } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not logged in. Please sign in to pay online.",
      });
    }
    if (!items?.length) {
      return res
        .status(400)
        .json({ success: false, message: "No items in cart" });
    }
    if (
      !address?.fullName ||
      !address?.email ||
      !address?.phone ||
      !address?.address1 ||
      !address?.city ||
      !address?.state ||
      !address?.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete delivery address is required",
      });
    }

    let resolvedDiscount = 0;
    let resolvedCouponCode = "";

    if (couponCode) {
      try {
        const discountResult = await resolveOrderDiscount({
          couponCode,
          items,
          userId,
          addressPhone: address?.phone,
        });
        resolvedDiscount = discountResult.discount;
        resolvedCouponCode = discountResult.couponCode;
      } catch (couponError) {
        return res
          .status(400)
          .json({ success: false, message: couponError.message });
      }
    }

    const {
      subtotal,
      tax,
      amount: payable,
    } = computeOrderAmounts(items, resolvedDiscount);
    const amountInPaise = Math.round(payable * 100);

    if (amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: "Order total must be at least ₹1 for online payment",
      });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Payment gateway is not configured on the server",
      });
    }

    const pendingOrderId = `RP-PENDING-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

    const newOrder = new orderModel({
      orderid: pendingOrderId,
      userId,
      items,
      subtotal,
      tax,
      amount: payable,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      couponCode: resolvedCouponCode,
      discount: resolvedDiscount,
    });
    await newOrder.save();

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: newOrder._id.toString(),
    });

    newOrder.orderid = razorpayOrder.id;
    await newOrder.save();

    res.json({ success: true, order: razorpayOrder });
  } catch (error) {
    console.error("Error in placeOrderRazorpay:", error);
    const razorpayMessage = error?.error?.description || error?.description;
    res.status(500).json({
      success: false,
      message: razorpayMessage || error.message || "Server Error",
    });
  }
};

const sendPaymentConfirmationOnlineEmail = (order) => {
  // Format date helper (dd/mm/yyyy)
  const formatDateDDMMYYYY = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Build delivery message
  let deliveryMessage = 'Your payment has been successfully processed. Your order is now being processed and will be shipped soon.';
  if (order.estimatedDelivery && order.estimatedDelivery.maxDays) {
    const days = order.estimatedDelivery.maxDays;
    const dayLabel = days > 1 ? 'days' : 'day';
    const dateStr = order.estimatedDelivery.estimatedDate
      ? ` (by ${formatDateDDMMYYYY(order.estimatedDelivery.estimatedDate)})`
      : '';
    deliveryMessage = `Your payment has been confirmed and your order is expected to be delivered within ${days} ${dayLabel}${dateStr}.`;
  }

  // Build delivery info block (optional but consistent with COD email)
  const deliveryInfoHtml = (order.estimatedDelivery && order.estimatedDelivery.maxDays) ? `
    <div class="delivery-info" style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top:0;">Estimated Delivery</h3>
        <p>
            Expected within ${order.estimatedDelivery.maxDays} day${order.estimatedDelivery.maxDays > 1 ? 's' : ''}
            ${order.estimatedDelivery.estimatedDate ? `(by ${formatDateDDMMYYYY(order.estimatedDelivery.estimatedDate)})` : ''}
        </p>
        ${order.estimatedDelivery.courier ? `<p>Courier: ${order.estimatedDelivery.courier}</p>` : ''}
    </div>
  ` : '';

  sendEmailInBackground({
    to: order.address.email,
    subject: `Payment Confirmed - Order #${order.orderid}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background-color: #10b981;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            color: white;
            margin: 0;
        }
        .content {
            padding: 30px;
        }
        .order-details {
            background-color: #f9fafb;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .product {
            display: flex;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eeeeee;
        }
        .product:last-child {
            border-bottom: none;
        }
        .product-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            margin-right: 15px;
            border-radius: 5px;
        }
        .product-info {
            flex: 1;
        }
        .summary {
            background-color: #f0f9ff;
            border-left: 4px solid #4f46e5;
            padding: 15px;
            margin-top: 20px;
        }
        .footer {
            background-color: #f3f4f6;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
        .delivery-info {
            background-color: #f0fdf4;
            border-left: 4px solid #22c55e;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Payment Confirmed</h1>
        </div>
        
        <div class="content">
            <h2>Thank you for your order!</h2>
            <p>Hi ${order.address.fullName},</p>
            <p>${deliveryMessage}</p>
            
            ${deliveryInfoHtml}
            
            <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${order.orderid}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                
                <h4>Items Ordered</h4>
                ${order.items
                  .map(
                    (item) => `
                    <div class="product">
                        <img src="${item.image}" alt="${item.name}" class="product-image">
                        <div class="product-info">
                            <p><strong>${item.name}</strong></p>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Price: ₹${item.price}</p>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
                
                <div class="summary">
                    ${formatOrderSummaryHtml(order)}
                    <p>Payment Method: ${order.paymentMethod}</p>
                    <p>Payment Status: Paid</p>
                </div>
            </div>
            
            <div>
                <h3>Shipping Address</h3>
                <p>
                    ${order.address.fullName} <br>
                    ${order.address.company ? order.address.company + "<br>" : ""}
                    ${order.address.address1}<br>
                    ${order.address.address2 ? order.address.address2 + "<br>" : ""}
                    ${order.address.city}, ${order.address.postalCode}<br>
                  
                    Phone: ${order.address.phone}
                </p>
            </div>
            
            <p>If you have any questions, contact our customer service team at <a href="mailto:enquiry@zayoraa.in">enquiry@zayoraa.in</a>.</p>
            
            <a href="${process.env.FRONTEND_URL}/orders/${order.orderid}" class="button">View Order Status</a>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <p>123 Business Street, City, Country</p>
        </div>
    </div>
</body>
</html>
      `,
  });
};
// ---------------- Verify Razorpay Payment ----------------
// const verifyRazorpay = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     const generated_signature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (generated_signature !== razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Invalid payment signature" });
//     }

//     const updatedOrder = await orderModel.findOneAndUpdate(
//       { orderid: razorpay_order_id },
//       { payment: true },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     res.json({ success: true, message: "Payment verified successfully", order: updatedOrder });
//   } catch (error) {
//     console.error("Error verifying Razorpay payment:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    const updatedOrder = await orderModel.findOneAndUpdate(
      { orderid: razorpay_order_id },
      {
        payment: true,
        paymentId: razorpay_payment_id, // Store payment ID for reference
        updatedAt: Date.now(),
      },
      { new: true },
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // --- Fetch EDD for verified order ---
    // --- Fetch EDD for verified order ---
    const eddResult = await getEstimatedDeliveryDate({
      pickupPincode: process.env.SHIPROCKET_PICKUP_PINCODE,
      deliveryPincode: updatedOrder.address.postalCode,
      weight: calculateTotalWeight(updatedOrder.items),
      isCod: false, // Razorpay orders are prepaid
    });

    console.log("EDD result:", JSON.stringify(eddResult, null, 2));

    if (eddResult && eddResult.couriers && eddResult.couriers.length > 0) {
      let courier = eddResult.couriers[0];
      if (eddResult.recommendedCourierId) {
        const recommended = eddResult.couriers.find(
          (c) => c.courier_company_id === eddResult.recommendedCourierId,
        );
        if (recommended) courier = recommended;
      }

      const days = parseInt(courier.estimated_delivery_days, 10) || 0;
      let estimatedDate = null;
      if (courier.etd) {
        estimatedDate = new Date(courier.etd);
        if (isNaN(estimatedDate.getTime())) estimatedDate = null;
      }

      updatedOrder.estimatedDelivery = {
        minDays: days,
        maxDays: days,
        courier: courier.courier_name,
        estimatedDate: estimatedDate,
      };
      await updatedOrder.save();
    }

    // ... handle coupon, send email, create Shiprocket order, etc. ...

    if (updatedOrder.couponCode && updatedOrder.userId) {
      const coupon = await Coupon.findOne({
        couponCode: updatedOrder.couponCode,
      });
      if (coupon?.isWelcomeCoupon) {
        await consumeWelcomeDiscount(
          updatedOrder.userId,
          updatedOrder.couponCode,
        );
      }
    }

    if (!updatedOrder.address?.email) {
      console.warn(
        `Payment verified for order ${updatedOrder.orderid} but no customer email on file`,
      );
    } else {
      sendPaymentConfirmationOnlineEmail(updatedOrder);
    }

    // Create Shiprocket order (non-blocking)
    // createShiprocketOrder(updatedOrder).catch((err) =>
    //   console.error("Async Shiprocket error:", err),
    // );

    // Create Shiprocket order and save IDs
try {
  const shiprocketResponse = await createShiprocketOrder(updatedOrder);
  if (shiprocketResponse?.order_id) {
    updatedOrder.shiprocketOrderId = shiprocketResponse.order_id.toString();
    updatedOrder.shiprocketShipmentId = shiprocketResponse.shipment_id?.toString() || '';
    await updatedOrder.save();
  }
} catch (err) {
  console.error('Shiprocket order creation failed (non-fatal):', err);
}

    res.json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- Admin: All Orders ----------------
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Get Single Order (by orderid) ----------------
const userSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.findOne({ orderid: id }).lean();

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Internal Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error. Please try again." });
  }
};

// ---------------- User Orders ----------------
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Admin: Update Status ----------------
// ---------------- Admin/User: Update Status ----------------
// const updateStatus = async (req, res) => {
//   try {
//     const { orderid, status } = req.body;
//     const updated = await orderModel.findOneAndUpdate(
//       { orderid }, // match with orderid
//       { status },
//       { new: true }
//     );
//     if (!updated) return res.status(404).json({ success: false, message: "Order not found" });
//     res.json({ success: true, message: "Order updated", order: updated });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const updateStatus = async (req, res) => {
  try {
    const { orderid, status } = req.body;
    const updated = await orderModel.findOneAndUpdate(
      { orderid },
      { status },
      { new: true },
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    // Send status update email (non-blocking)
    sendStatusUpdateEmail(updated);

    res.json({ success: true, message: "Order updated", order: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function to send status update email
const sendStatusUpdateEmail = (order) => {
  let subject = "";
  let statusMessage = "";
  let instructions = "";
  let color = "";
  let buttonText = "View Order Details";

  // Customize email based on status
  switch (order.status.toLowerCase()) {
    case "cancelled":
      subject = `Your Order #${order.orderid} Has Been Cancelled`;
      statusMessage = "Your order has been cancelled as requested.";
      instructions =
        "If this was a mistake or if you have any questions, please contact our customer support team immediately.";
      color = "#ef4444"; // Red
      buttonText = "Contact Support";
      break;
    case "returned":
      subject = `Your Return Request for Order #${order.orderid}`;
      statusMessage = "Your return request has been processed successfully.";
      instructions =
        "Please allow 5-7 business days for the refund to be processed to your original payment method. You will receive an email confirmation once the refund is initiated.";
      color = "#f59e0b"; // Amber
      buttonText = "Track Return";
      break;
    case "delivered":
      subject = `Your Order #${order.orderid} Has Been Delivered`;
      statusMessage = "Your order has been successfully delivered!";
      instructions =
        "We hope you're enjoying your products. Thank you for shopping with us!";
      color = "#10b981"; // Green
      buttonText = "Rate Your Purchase";
      break;
    case "shipped":
      subject = `Your Order #${order.orderid} Has Been Shipped`;
      statusMessage = "Your order is on the way!";
      instructions =
        "You can track your package using the tracking information below. Expected delivery date is within 3-5 business days.";
      color = "#3b82f6"; // Blue
      buttonText = "Track Package";
      break;
    case "processing":
      subject = `Your Order #${order.orderid} is Being Processed`;
      statusMessage =
        "We've received your order and are preparing it for shipment.";
      instructions =
        "You'll receive another notification when your order ships. Typically, orders are processed within 24-48 hours.";
      color = "#8b5cf6"; // Purple
      break;
    default:
      subject = `Update on Your Order #${order.orderid}`;
      statusMessage = `Your order status has been updated to: ${order.status}`;
      instructions = "";
      color = "#6b7280"; // Gray
  }

  // Generate tracking info if shipped
  const trackingInfo =
    order.status.toLowerCase() === "shipped"
      ? `<p><strong>Tracking Number:</strong> TRK-${order.orderid.slice(-8).toUpperCase()}</p>
       <p><strong>Carrier:</strong> Standard Shipping</p>`
      : "";

  // Generate different button URLs based on status
  let buttonUrl = `${process.env.FRONTEND_URL}/orders/${order.orderid}`;
  if (order.status.toLowerCase() === "cancelled") {
    buttonUrl = `${process.env.FRONTEND_URL}/contact`;
  } else if (order.status.toLowerCase() === "returned") {
    buttonUrl = `${process.env.FRONTEND_URL}/returns/${order.orderid}`;
  } else if (order.status.toLowerCase() === "delivered") {
    buttonUrl = `${process.env.FRONTEND_URL}/review/${order.orderid}`;
  } else if (order.status.toLowerCase() === "shipped") {
    buttonUrl = `${process.env.FRONTEND_URL}/tracking/${order.orderid}`;
  }

  sendEmailInBackground({
    to: order.address.email,
    subject: subject,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background-color: ${color};
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            color: white;
            margin: 0;
        }
        .content {
            padding: 30px;
        }
        .status-update {
            background-color: #f9fafb;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 4px solid ${color};
        }
        .order-details {
            background-color: #f9fafb;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .product {
            display: flex;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eeeeee;
        }
        .product:last-child {
            border-bottom: none;
        }
        .product-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            margin-right: 15px;
            border-radius: 5px;
        }
        .product-info {
            flex: 1;
        }
        .footer {
            background-color: #f3f4f6;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: ${color};
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
            font-weight: bold;
        }
        .tracking-info {
            background-color: #eff6ff;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Status Update</h1>
        </div>
        
        <div class="content">
            <h2>${subject}</h2>
            <p>Hi ${order.address.fullName},</p>
            
            <div class="status-update">
                <h3>Status: ${order.status}</h3>
                <p>${statusMessage}</p>
                ${instructions ? `<p>${instructions}</p>` : ""}
                
                ${
                  order.status.toLowerCase() === "shipped"
                    ? `
                <div class="tracking-info">
                    <h4>Tracking Information</h4>
                    ${trackingInfo}
                </div>
                `
                    : ""
                }
                
                ${
                  order.status.toLowerCase() === "returned"
                    ? `
                <div class="tracking-info">
                    <h4>Return Details</h4>
                    <p><strong>Return ID:</strong> RTN-${order.orderid.slice(-8).toUpperCase()}</p>
                    <p><strong>Refund Method:</strong> Original payment method</p>
                    <p><strong>Processing Time:</strong> 5-7 business days</p>
                </div>
                `
                    : ""
                }
            </div>
            
            <div class="order-details">
                <h3>Order Summary</h3>
                <p><strong>Order ID:</strong> ${order.orderid}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                
                <h4>Items</h4>
                ${order.items
                  .map(
                    (item) => `
                    <div class="product">
                        <img src="${item.image}" alt="${item.name}" class="product-image">
                        <div class="product-info">
                            <p><strong>${item.name}</strong></p>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Price: ₹${item.price}</p>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
                
                ${formatOrderSummaryHtml(order)}
            </div>
            
            <div>
                <h3>Shipping Address</h3>
                <p>
                    ${order.address.fullName} <br>
                    ${order.address.company ? order.address.company + "<br>" : ""}
                    ${order.address.address1}<br>
                    ${order.address.address2 ? order.address.address2 + "<br>" : ""}
                    ${order.address.city}, ${order.address.postalCode}<br>
                    ${order.address.country}<br>
                    Phone: ${order.address.phone}
                </p>
            </div>
            
            <p>If you have any questions about your order, contact our customer service team at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a> or call us at ${process.env.SUPPORT_PHONE || "1-800-123-4567"}.</p>
            
            <a href="${buttonUrl}" class="button">${buttonText}</a>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || "Your Company Name"}. All rights reserved.</p>
            <p>${process.env.COMPANY_ADDRESS || "123 Business Street, City, Country"}</p>
        </div>
    </div>
</body>
</html>
      `,
  });
};






// ---------------- Get Tracking Info from Shiprocket ----------------
// controllers/orderController.js



export const getTrackingInfo = async (req, res) => {
  const { orderid } = req.params;
  console.log(`🔍 Tracking request for orderid: ${orderid}`);

  try {
    // 1. Find order in DB
    let order = await orderModel.findOne({ orderid });
    if (!order && /^\d+$/.test(orderid)) {
      order = await orderModel.findOne({ shiprocketOrderId: orderid });
    }
    if (!order) {
      console.log('❌ Order not found in DB');
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    console.log(`✅ Order found in DB: orderid=${order.orderid}, shiprocketOrderId=${order.shiprocketOrderId}`);

    if (!order.shiprocketOrderId) {
      console.log('⚠️ No shiprocketOrderId, returning DB status');
      return res.json({
        success: true,
        tracking: {
          orderStatus: order.status,
          fromDB: true,
          message: 'No Shiprocket order linked, showing saved status.',
          estimatedDelivery: order.estimatedDelivery || null,
        },
      });
    }

    // 2. Get Shiprocket token
    console.log('🔑 Getting Shiprocket token...');
    const token = await getShiprocketToken();
    console.log('✅ Token obtained');

    // 3. Call Shiprocket's /orders/show/{id} endpoint
    const url = `https://apiv2.shiprocket.in/v1/external/orders/show/${order.shiprocketOrderId}`;
    console.log(`🌐 Calling Shiprocket: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('✅ Shiprocket response received, status:', response.status);
    // The response data is inside response.data.data
    const shiprocketData = response.data?.data || {};
    console.log('📦 Shiprocket order data:', JSON.stringify(shiprocketData, null, 2));

    // 4. Extract fields from the nested data object
    const liveStatus = shiprocketData.status || order.status;
    const awb = shiprocketData.awb_data?.awb || null; // actual AWB may be here or in shipments.awb
    const courierFromShiprocket = shiprocketData.shipments?.courier || null; // if assigned

    // For courier name, if not in shipments, fallback to DB
    const courier = courierFromShiprocket || order.estimatedDelivery?.courier || null;

    // Tracking events might be available later; for now use empty array
    // You can also fetch from /courier/track if needed

    const trackingData = {
      orderStatus: liveStatus,
      awb: awb,
      courier: courier,
      estimatedDelivery: order.estimatedDelivery || null,
      trackingEvents: [], // could fetch separately if needed
      fulfillmentStatus: shiprocketData.fulfillment_status || null,
      shipmentId: shiprocketData.shipments?.id || null,
      orderId: shiprocketData.id || null,
      // Also include sub-status if available
      subStatus: shiprocketData.sub_status || null,
    };

    console.log('📤 Returning tracking data:', trackingData);
    return res.json({ success: true, tracking: trackingData });
  } catch (error) {
    console.error('❌ Error in getTrackingInfo:');
    if (error.response) {
      console.error('  Status:', error.response.status);
      console.error('  Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('  No response received:', error.request);
    } else {
      console.error('  Error message:', error.message);
    }
    console.error('  Stack:', error.stack);

    // Fallback: return DB status
    try {
      const fallbackOrder = await orderModel.findOne({
        $or: [{ orderid }, { shiprocketOrderId: orderid }],
      });
      if (fallbackOrder) {
        console.log('🔄 Falling back to DB status for order:', fallbackOrder.orderid);
        return res.json({
          success: true,
          tracking: {
            orderStatus: fallbackOrder.status,
            fromDB: true,
            message: 'Live tracking not available, showing saved status.',
            estimatedDelivery: fallbackOrder.estimatedDelivery || null,
          },
        });
      }
    } catch (dbError) {
      console.error('Fallback DB error:', dbError);
    }

    return res.status(500).json({ success: false, message: 'Unable to fetch tracking information' });
  }
};



export {
  placeOrderCOD,
  placeOrderRazorpay,
  verifyRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  userSingleOrder,
};
