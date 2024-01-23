// src/routes/chat.js

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.user = decoded; // Attach user information to the request
    next();
  } catch (error) {
    console.error('Authentication failed', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Protected chat endpoint requiring authentication
router.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Protected endpoint accessed', user: req.user });
});

module.exports = router;
