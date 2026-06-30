// utils/shiprocket.js
import axios from 'axios';
import crypto from 'crypto';

let cachedToken = null;
let tokenExpiry = null;

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;
const PICKUP_LOCATION = process.env.SHIPROCKET_PICKUP_LOCATION || 'home-2';

// Default dimensions & weight (can be made dynamic per product later)
const DEFAULT_LENGTH = 8;
const DEFAULT_BREADTH = 8;
const DEFAULT_HEIGHT = 3.5;
const DEFAULT_WEIGHT = 0.2;
const DEFAULT_HSN = 441122;

async function getShiprocketToken() {
  // Return cached token if still valid (Shiprocket tokens last ~1 hour)
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/auth/login',
      {
        email: SHIPROCKET_EMAIL,
        password: SHIPROCKET_PASSWORD,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    cachedToken = response.data.token;
    // Set expiry to 50 minutes (Shiprocket token expires in 1 hour)
    tokenExpiry = Date.now() + 50 * 60 * 1000;
    return cachedToken;
  } catch (error) {
    console.error('Shiprocket authentication failed:', error.response?.data || error.message);
    throw new Error('Could not authenticate with Shiprocket');
  }
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

/**
 * Create a Shiprocket order from your order document
 * @param {Object} order - The order document from your database
 * @returns {Promise<Object>} Shiprocket response
 */
export async function createShiprocketOrder(order) {
  try {
    const token = await getShiprocketToken();

    // Map your order items to Shiprocket's order_items
    const orderItems = order.items.map((item) => ({
      name: item.name,
      sku: item.productId || item._id || 'SKU-' + crypto.randomBytes(4).toString('hex'),
      units: item.quantity,
      selling_price: Number(item.price).toFixed(2),
      hsn: DEFAULT_HSN, // You can fetch from product model if stored
    }));

    // Determine payment method: prepaid for online, postpaid for COD
    const paymentMethod = order.paymentMethod === 'COD' ? 'postpaid' : 'prepaid';

    const payload = {
      order_id: order.orderid,
      order_date: formatDate(order.createdAt || Date.now()),
      pickup_location: PICKUP_LOCATION,
      comment: '',
      billing_customer_name: order.address.fullName,
      billing_last_name: '',
      billing_address: order.address.address1,
      billing_address_2: order.address.address2 || '',
      billing_city: order.address.city,
      billing_pincode: order.address.postalCode,
      billing_state: order.address.state,
      billing_country: order.address.country || 'India',
      billing_email: order.address.email,
      billing_phone: order.address.phone,
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: paymentMethod,
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: Number(order.discount) || 0,
      sub_total: Number(order.subtotal || order.amount).toFixed(2),
      length: DEFAULT_LENGTH,
      breadth: DEFAULT_BREADTH,
      height: DEFAULT_HEIGHT,
      weight: DEFAULT_WEIGHT,
    };

    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`Shiprocket order created for ${order.orderid}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Shiprocket creation failed for order ${order.orderid}:`, error.response?.data || error.message);
    // Log the error but do not rethrow – we don't want to fail the order placement.
    return null;
  }
}