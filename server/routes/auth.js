const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Agent = require('../models/Agent');
const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

// Customer/User registration
router.post('/signup', async (req, res) => {
  try {
    const { username, password, currency, deviceID, shopName, email, phone } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newUser = await User.create({
      username,
      password,
      currency,
      deviceID,
      shopName,
      email,
      phone,
      approved: true
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          role: newUser.role,
          currency: newUser.currency,
          shopName: newUser.shopName
        }
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login for all user types
router.post('/login', async (req, res) => {
  try {
    const { username, password, deviceID } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Please provide username and password' });
    }

    // Try to find in User collection first
    let user = await User.findOne({ username }).select('+password');
    let userType = 'user';

    // If not found in User, try Agent
    if (!user) {
      user = await Agent.findOne({ email: username }).select('+password');
      userType = 'agent';
    }

    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }

    // Check device ID for users
    if (userType === 'user' && user.deviceID !== deviceID) {
      return res.status(401).json({ error: 'Device not authorized for this account' });
    }

    const token = signToken(user._id);

    res.json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          username: user.username || user.email,
          role: user.role || userType,
          currency: user.currency,
          shopName: user.shopName
        }
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;