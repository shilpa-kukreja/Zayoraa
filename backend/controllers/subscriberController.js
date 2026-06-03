import subscribeModel from "../models/subscribeModel.js";
import nodemailer from "nodemailer";





// export const addSubscriber = async (req, res) => {
//     try {
//         const { email } = req.body; 
//         if (!email) {
//             return res.status(400).json({ message: 'Email is required' });
//         }
//         const existingSubscriber = await subscribeModel.find({ email });
//         if (existingSubscriber.length > 0) {
//             return res.status(400).json({ message: 'Email already subscribed' });
//         }
//         const newSubscriber = new subscribeModel({ email });
//         await newSubscriber.save();
//         res.status(201).json({ message: 'Subscription successful' });
//     }catch (error) {
//         console.error('Error adding subscriber:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };






export const addSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingSubscriber = await subscribeModel.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const newSubscriber = new subscribeModel({ email });
    await newSubscriber.save();

    // ✅ Send Beautiful Email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use SMTP
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    const mailOptions = {
      from: `"My Website" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to Our Newsletter!",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f9f9f9; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; padding-bottom: 20px;">
          <img src="https://img.icons8.com/clouds/200/newsletter.png" alt="Welcome" style="width:120px;"/>
          <h2 style="color:#333;">Welcome to Our Community 🎉</h2>
        </div>
        <p style="font-size:16px; color:#555;">
          Hi there 👋, <br/><br/>
          Thank you for subscribing to our newsletter. You’re now part of our family!  
        </p>
        <p style="font-size:16px; color:#555;">
          We’ll keep you updated with the latest news, special offers, and exclusive content.  
        </p>
        <div style="text-align:center; margin:30px 0;">
          <a href="http://localhost:3000/" style="background:#007bff; color:white; padding:12px 25px; border-radius:30px; text-decoration:none; font-size:16px;">Visit Our Website</a>
        </div>
        <hr/>
        <p style="font-size:12px; color:#888; text-align:center;">
          You received this email because you subscribed on our website.  
        </p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Subscription successful & Email sent" });
  } catch (error) {
    console.error("Error adding subscriber:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





export const getSubscribers = async (req, res) => {
    try {
        const subscribers = await subscribeModel.find().sort({ subscribedAt: -1 });
        res.status(200).json(subscribers);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// controllers/subscriberController.js
export const removeSubscriber = async (req, res) => {
  try {
    const { id } = req.params; // this is actually an email in your case

    const deleted = await  subscribeModel.findOneAndDelete({ email: id });

    if (!deleted) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    res.status(200).json({ message: "Subscriber removed successfully" });
  } catch (error) {
    console.error("Error removing subscriber:", error);
    res.status(500).json({ message: "Server error" });
  }
};

