import jwt from 'jsonwebtoken';
import otpModel from '../models/otpModel.js';
import userModel from '../models/authModel.js';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { createWelcomeCouponForUser } from '../utils/welcomeDiscount.js';






const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//Route for admin Login

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      return res.status(200).json({ success: true, token })
    } else {
      return res.status(401).json({ success: false, message: "Invalid email or password" })
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}








// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 📌 Send OTP
export const loginotp = async (req, res) => {
  try {
    const { number } = req.body;
    const otp = generateOTP();

    // Save or update OTP in DB
    await otpModel.findOneAndUpdate(
      { number },
      { number, otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // 👉 Fast2SMS API
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "dlt",
        sender_id: "HELSTR",
        message: "195392", // Your DLT template ID
        variables_values: otp,
        numbers: number,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Verify OTP & Create User
// export const verifyotp = async (req, res) => {
//   try {
//     const { number, username, email, otp } = req.body;

//     // Check OTP from otpModel
//     const otpRecord = await otpModel.findOne({ number, otp });
//     if (!otpRecord) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired OTP",
//       });
//     }

//     // Save user (if not exists)
//     let user = await userModel.findOne({ number });
//     if (!user) {
//       user = await userModel.create({
//         username,
//         email,
//         number,
//         verifiedAt: new Date(),
//       });
//     }

//     // Delete OTP after verification
//     await otpModel.deleteMany({ number });

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, number: user.number },
//       process.env.JWT_SECRET,
//       { expiresIn: "30d" }
//     );

//     res.json({
//       success: true,
//       message: "Number verified successfully",
//       token,
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


export const verifyotp = async (req, res) => {
  try {
    const { number, username = '', email = '', otp, fromWelcome = false } = req.body;

    // Check OTP from otpModel
    const otpRecord = await otpModel.findOne({ number, otp });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Check if user already exists
    let user = await userModel.findOne({ number });
    let isNewUser = false;

    if (!user) {
      // Create new user if doesn't exist
      user = await userModel.create({
        username,
        email,
        number,
        verifiedAt: new Date(),
      });
      isNewUser = true;
    }

    // Delete OTP after verification
    await otpModel.deleteMany({ number });

    let welcomeCouponCode = user.welcomeCouponCode || null;

    if (isNewUser && fromWelcome) {
      const welcomeResult = await createWelcomeCouponForUser(user);
      if (welcomeResult.success) {
        welcomeCouponCode = welcomeResult.couponCode;
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, number: user.number },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Send welcome email only for new users
    if (isNewUser && email) {
      await sendWelcomeEmail(username, email);
    }

    res.json({
      success: true,
      message: "Number verified successfully",
      token,
      user,
      isNewUser,
      welcomeUnlocked: !!(isNewUser && fromWelcome && welcomeCouponCode),
      welcomeCouponCode,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Function to send welcome email
const sendWelcomeEmail = async (username, email) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Welcome to ${process.env.COMPANY_NAME || 'Our Store'}!`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Store</title>
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
            background-color: #4f46e5;
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
        .welcome-section {
            background-color: #f0f9ff;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 4px solid #4f46e5;
        }
        .benefits {
            margin: 20px 0;
        }
        .benefit-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .benefit-icon {
            width: 24px;
            height: 24px;
            margin-right: 10px;
            background-color: #4f46e5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
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
            background-color: #4f46e5;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome Aboard!</h1>
        </div>
        
        <div class="content">
            <h2>Hello ${username},</h2>
            
            <div class="welcome-section">
                <h3>Thank you for joining ${process.env.COMPANY_NAME || 'our store'}!</h3>
                <p>We're excited to have you as part of our community. Your account has been successfully created and verified.</p>
            </div>
            
            <div class="benefits">
                <h3>Here's what you can do with your account:</h3>
                
                <div class="benefit-item">
                    <div class="benefit-icon">✓</div>
                    <p>Track your orders in real-time</p>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">✓</div>
                    <p>Save multiple shipping addresses</p>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">✓</div>
                    <p>Get exclusive deals and promotions</p>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">✓</div>
                    <p>Write reviews for products you've purchased</p>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">✓</div>
                    <p>Quick checkout with saved payment methods</p>
                </div>
            </div>
            
            <p>Start shopping now and discover our amazing products!</p>
            
            <a href="${process.env.FRONTEND_URL}" class="button">Start Shopping</a>
            
            <p>If you have any questions, feel free to contact our customer support team at <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@yourcompany.com'}">${process.env.SUPPORT_EMAIL || 'support@yourcompany.com'}</a>.</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'Your Company Name'}. All rights reserved.</p>
            <p>${process.env.COMPANY_ADDRESS || '123 Business Street, City, Country'}</p>
        </div>
    </div>
</body>
</html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to:", email);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};



export const getUser = async (req, res) => {
  try {

    const user = await userModel.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const allUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// export const adduseraddress= async (req, res) => {
//   try {
//     const { address } = req.body;
//     const user = await userModel.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }
//     user.address.push(address);
//     await user.save();
//     res.json({ success: true, message: "Address added successfully", user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// controller/addressController.js


// export const addUserAddress = async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       phone,
//       address1,
//       address2,
//       addresstype,
//       city,
//       state,
//       postalCode,
//       landmark,
//       isDefault,
//     } = req.body;

//     if (!fullName || !email || !phone || !address1 || !city || !state || !postalCode) {
//       return res.status(400).json({ success: false, message: "All required fields must be filled" });
//     }

//     const user = await userModel.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const newAddress = {
//       fullName,
//       email,
//       phone,
//       address1,
//       address2,
//       addresstype,
//       city,
//       state,
//       postalCode,
//       landmark,
//       isDefault: isDefault || false,
//     };

//     // push into user's address array
//     user.address.push(newAddress);
//     await user.save();

//     res.json({ success: true, message: "Address added successfully", user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


export const addUserAddress = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address1,
      address2,
      addresstype,
      city,
      state,
      postalCode,
      landmark,
      isDefault,
    } = req.body;

    const user = await userModel.findById(req.user.id); // 👈 authMiddleware must set this
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newAddress = {
      fullName,
      email,
      phone,
      address1,
      address2,
      addresstype,
      city,
      state,
      postalCode,
      landmark,
      isDefault: isDefault || false,
    };

    // push into user's address array
    user.address.push(newAddress);  // 👈 if user.address is undefined → error
    await userModel.findByIdAndUpdate(user._id, { address: user.address }); // 👈 safer save

    res.json({ success: true, message: "Address added successfully", user });
  } catch (error) {
    console.error("❌ Add Address Error:", error.message); // 👈 add this
    res.status(500).json({ success: false, error: error.message });
  }
};



// export const getuseraddress = async (req, res) => {
//   try {
//     const user = await userModel.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }
//     res.json({ success: true, address: user.address });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

export const getUserAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, address: user.address });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};





// export const deleteuseraddress = async (req, res) => {
//   try {
//     const { addressId } = req.params;
//     const user = await userModel.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }
//     user.address = user.address.filter((address) => address._id.toString() !== addressId);  
//     await user.save();
//     res.json({ success: true, message: "Address deleted successfully", user });
//   }
//   catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


export const deleteUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.address = user.address.filter(
      (address) => address._id.toString() !== addressId
    );

    await user.save({ validateBeforeSave: false }); // ✅ skip validation

    res.json({
      success: true,
      message: "Address deleted successfully",
      address: user.address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};





export const updateUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { fullName, email, phone, address1, address2, addresstype, city, state, postalCode, landmark } = req.body;

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const address = user.address.id(addressId); // find subdocument by _id
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    // update only the provided fields
    if (fullName) address.fullName = fullName;
    if (email) address.email = email;
    if (phone) address.phone = phone;
    if (address1) address.address1 = address1;
    if (address2) address.address2 = address2;
    if (addresstype) address.addresstype = addresstype;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postalCode) address.postalCode = postalCode;
    if (landmark) address.landmark = landmark;

    await user.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      address: user.address,  // ✅ return updated addresses
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const edituser = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Find logged in user
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;

    // Handle image upload (if file provided)
    if (req.file) {
      user.img = `/uploads/blogs/${req.file.filename}`;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

