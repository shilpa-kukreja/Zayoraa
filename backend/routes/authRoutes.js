import express from 'express';
import {   addUserAddress, adminLogin, allUsers, deleteUser, deleteUserAddress, edituser, getUser, getUserAddress, loginotp, updateUserAddress, verifyotp } from '../controllers/authController.js';
import { getWelcomeDiscountStatus, unlockWelcomeDiscount } from '../controllers/welcomeDiscountController.js';
import upload from '../middlewares/blogMulter.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';



const authRoutes = express.Router();

authRoutes.post('/admin-login', adminLogin);
authRoutes.post('/verify-otp',verifyotp)
authRoutes.post('/loginotp',loginotp)
authRoutes.get('/getuser',authMiddleware,getUser)
authRoutes.patch('/updateuser',authMiddleware,upload.single('image'),edituser)
authRoutes.get('/getalluser',allUsers)
authRoutes.post('/deleteuser',deleteUser)
authRoutes.post('/addaddress' ,authMiddleware,addUserAddress)
authRoutes.get('/getaddress',authMiddleware,getUserAddress)
authRoutes.delete('/deleteaddress/:addressId', authMiddleware, deleteUserAddress);
authRoutes.put('/editaddress/:addressId', authMiddleware, updateUserAddress);
authRoutes.get('/welcome-discount', authMiddleware, getWelcomeDiscountStatus);
authRoutes.post('/welcome-discount/unlock', authMiddleware, unlockWelcomeDiscount);


export default authRoutes;