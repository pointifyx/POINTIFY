const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Agent = require('../models/Agent');
const RetailTrack = require('../models/RetailTrack');
const nodemailer = require('nodemailer');
const router = express.Router();

// ⚠️ MANUAL UPDATE REQUIRED: Configure your email service
const transporter = nodemailer.createTransport({
    service: 'gmail',
  auth: {
    user: 'adamothmani114@gmail.com',
    pass: 'sdht afwp wpvl kgtw'
  }
});

// Protect middleware
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const decoded = jwt.verify(token, 'your-jwt-secret-change-in-production');
    
    // For admin routes, we'll check if it's actually an admin
    // In production, you'd have proper admin authentication
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized' });
  }
};

// Send verification code for admin login
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    // In production, validate admin email
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    await transporter.sendMail({
      from: 'pointify@yourdomain.com',
      to: email,
      subject: 'Pointify Admin Login Verification',
      html: `
        <h2>Pointify Admin Login Verification</h2>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    });

    // In production, store the code in database with expiration
    res.json({ 
      status: 'success', 
      message: 'Verification code sent to email',
      tempCode: verificationCode // Remove this in production
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});

// Get pending approvals
router.get('/pending-approvals', protect, async (req, res) => {
  try {
    const pendingUsers = await User.find({ approved: false });
    res.json({ status: 'success', data: pendingUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve user
router.post('/approve-user/:userId', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId, 
      { approved: true }, 
      { new: true }
    );
    
    res.json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Suspend user
router.post('/suspend-user/:userId', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId, 
      { approved: false }, 
      { new: true }
    );
    
    res.json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all agents
router.get('/agents', protect, async (req, res) => {
  try {
    const agents = await Agent.find().populate('customers');
    res.json({ status: 'success', data: agents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system reports
router.get('/reports', protect, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAgents = await Agent.countDocuments();
    const pendingApprovals = await User.countDocuments({ approved: false });
    
    const reports = {
      totalUsers,
      totalAgents,
      pendingApprovals,
      revenue: 0, // You would calculate this from transactions
      activeShops: await User.countDocuments({ approved: true })
    };
    
    res.json({ status: 'success', data: reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;