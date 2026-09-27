const express = require('express');
const jwt = require('jsonwebtoken');
const Brokerage = require('../models/Brokerage');
const User = require('../models/User');

const router = express.Router();

// Signup: Create new user in a brokerage
 
router.post('/signup', async (req, res) => {
  try {
    const { brokerageId, email, password, name, role } = req.body;

    // Verify brokerage exists
    const brokerage = await Brokerage.findById(brokerageId);
    if (!brokerage) {
      return res.status(400).json({ error: 'Brokerage not found' });
    }

    // Check if user already exists in this brokerage
    const existingUser = await User.findOne({ brokerageId, email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists in this brokerage' });
    }

    // Create user
    const user = new User({
      brokerageId,
      email,
      password, // Will be hashed by pre-save hook
      name,
      role: role || 'advisor',
    });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        brokerageId: user.brokerageId,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        brokerageId: user.brokerageId,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login: Authenticate user
 
router.post('/login', async (req, res) => {
  try {
    const { email, password, brokerageId } = req.body;

    // Find user by brokerageId + email
    const user = await User.findOne({ brokerageId, email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        brokerageId: user.brokerageId,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        brokerageId: user.brokerageId,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;