import cron from 'node-cron';
import orderModel from '../models/orderModel.js';
import { sendReviewEmail } from '../utils/mailer.js';

cron.schedule('0 0 * * *', async () => {
  console.log('⏰ Running 7-day review email cron...');
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const startOfDay = new Date(sevenDaysAgo);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(sevenDaysAgo);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await orderModel.find({
      status: 'DELIVERED',
      deliveredAt: { $gte: startOfDay, $lt: endOfDay },
      reviewEmailSent: false,
    });

    for (const order of orders) {
      await sendReviewEmail(order);
      order.reviewEmailSent = true;
      await order.save();
      console.log(`📧 Review email sent for order ${order.orderid}`);
    }
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

console.log('✅ Review email cron started.');