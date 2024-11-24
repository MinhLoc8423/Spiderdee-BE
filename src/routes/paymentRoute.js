const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/payment', paymentController.createPaymentLink);
router.post('/callback', paymentController.callBack);
router.post('/check-status-order', paymentController.checkStatusOrder);

module.exports = router;
