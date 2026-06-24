import Support from '../models/support.js';
import Order from '../models/orderModel.js'; // if you have Order model

// @desc    Create a support request
// @route   POST /api/support
// @access  Private
export const createSupport = async (req, res) => {
  try {
    const { orderId, userId, name, phone, email, message } = req.body;

    if (!orderId || !userId || !name || !phone || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // optional: verify the order belongs to this user
    // const order = await Order.findOne({ orderid: orderId, userId });
    // if (!order) return res.status(404).json({ message: 'Order not found' });

    const support = new Support({
      userId,
      orderId,
      name,
      phone,
      email,
      message,
    });

    await support.save();
    res.status(201).json({ success: true, message: 'Support request submitted successfully', support });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get all support requests (admin)
export const getAllSupport = async (req, res) => {
  try {
    const supports = await Support.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, supports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update support status (e.g., mark as Resolved)
export const updateSupportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const support = await Support.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!support) {
      return res.status(404).json({ message: 'Support request not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated',
      support,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};