const express = require('express');
const User = require('../models/User');
const Agent = require('../models/Agent');
const router = express.Router();

// Agent registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, commission } = req.body;

    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ error: 'Agent already exists with this email' });
    }

    const agent = await Agent.create({
      name,
      email,
      password,
      commission: commission || 10
    });

    res.status(201).json({
      status: 'success',
      data: { agent }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get agent's customers
router.get('/:agentId/customers', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.agentId).populate('customers');
    res.json({ status: 'success', data: agent.customers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent commission report
router.get('/:agentId/commissions', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.agentId);
    
    // Calculate commission (this would be based on actual sales in production)
    const commissionReport = {
      totalCommission: agent.totalCommission,
      pendingCommission: 0, // You would calculate this
      customersCount: agent.customers.length,
      recentCommissions: [] // You would populate this from transactions
    };
    
    res.json({ status: 'success', data: commissionReport });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;