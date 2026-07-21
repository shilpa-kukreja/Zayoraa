// controllers/webhookController.js

import orderModel from "../models/orderModel.js";

const verifyWebhook = (req) => {
  let token = req.headers['authorization'] || req.headers['x-api-key'];
  if (!token) {
    throw new Error('No auth token provided');
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }
  if (token !== process.env.SHIPROCKET_WEBHOOK_SECRET) {
    throw new Error('Invalid webhook token');
  }
};

export const handleShiprocketWebhook = async (req, res) => {
  try {
    verifyWebhook(req);

    const payload = req.body;
    console.log('✅ Webhook received:', JSON.stringify(payload, null, 2));

    // 1. Extract fields from the payload
    const srOrderId = payload.sr_order_id;           // Shiprocket's numeric order ID
    const channelOrderId = payload.order_id;         // Could be your custom ID or numeric
    const newStatus = payload.current_status || payload.shipment_status;
    const delivered = newStatus && newStatus.toLowerCase() === 'delivered';

    if (!srOrderId && !channelOrderId) {
      console.warn('No order ID found in webhook');
      return res.status(400).json({ success: false, message: 'Missing order ID' });
    }

    // 2. Find the order in your DB
    let order = null;

    // Try to find by Shiprocket numeric ID first (most reliable)
    if (srOrderId) {
      order = await orderModel.findOne({ shiprocketOrderId: String(srOrderId) });
    }

    // If not found, try by channel_order_id (your custom ID)
    if (!order && channelOrderId) {
      order = await orderModel.findOne({ orderid: channelOrderId });
    }

    if (!order) {
      console.warn(`Order not found for sr_order_id: ${srOrderId} or order_id: ${channelOrderId}`);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // 3. Update order status
    if (newStatus) {
      order.status = newStatus;
      console.log(`🔄 Order ${order.orderid} status updated to: ${newStatus}`);
    }

    // 4. If delivered, record delivery date
    if (delivered) {
      order.deliveredAt = new Date();
      console.log(`📦 Order ${order.orderid} marked as delivered at ${order.deliveredAt}`);
    }

    // 5. Save the order
    await order.save();

    // 6. (Optional) If you want to immediately schedule a job, you could do it here,
    //    but we'll rely on the cron job to pick up orders with deliveredAt.

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Webhook error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};