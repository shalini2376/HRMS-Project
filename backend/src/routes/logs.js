const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { Log } = require('../../models');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const orgId = req.user.orgId;
    
    const logs = await Log.findAll({
      where: { organisationId: orgId },
      order: [['createdAt', 'DESC']],
    });

    // convert meta from string → object
    const formatted = logs.map(log => {
      const plain = log.toJSON();

      try {
        plain.meta = JSON.parse(plain.meta);
      } catch (e) {
        // If meta is not valid JSON, leave it as string
      }

      return plain;
    });
    
    return res.json(formatted);
  } catch (err) {
    console.error('logs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
