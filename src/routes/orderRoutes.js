const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

router.post('/create', controller.createOrder);
router.post('/item', controller.addOrderItem);
router.post('/payment', controller.processPayment);
router.get('/user/:user_id', controller.getUserOrders);
router.get('/detail/:order_id', controller.getOrderDetail);
router.put('/status', controller.updateOrderStatus);
router.delete('/cancel/:order_id', controller.cancelOrder);
router.put('/stock/subtract-bulk', controller.subtractStockBulk);

module.exports = router;