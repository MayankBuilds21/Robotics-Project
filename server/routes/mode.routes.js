const express = require('express');
const router = express.Router();

// Get current mode
router.get('/current', (req, res) => {
  res.json({ 
    mode: req.app.locals.currentMode || 'MANUAL',
    timestamp: new Date()
  });
});

// Switch to AI mode
router.post('/switch/ai', (req, res) => {
  try {
    req.app.locals.currentMode = 'AI';
    res.json({ 
      success: true, 
      mode: 'AI',
      message: 'Switched to AI mode'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Switch to Manual mode
router.post('/switch/manual', (req, res) => {
  try {
    req.app.locals.currentMode = 'MANUAL';
    res.json({ 
      success: true, 
      mode: 'MANUAL',
      message: 'Switched to Manual mode'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;