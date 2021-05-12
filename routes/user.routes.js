const express = require('express');

const router = express.Router();

router.route('/').get((req, res) => {
  res.json({
    data: 'API Setup',
  });
});

module.exports = router;
