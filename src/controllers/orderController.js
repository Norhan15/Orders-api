const orderService = require('../services/orderService');
const db = require('../config/db');
const axios = require('axios');


const createOrder = async (req, res) => {
  const { user_id, total } = req.body;
  try {
    const [result] = await orderService.createOrder(user_id, total);
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addOrderItem = async (req, res) => {
  const { order_id, product_id, product_name, quantity, price } = req.body;
  try {
    const [result] = await orderService.addOrderItem(order_id, product_id, product_name, quantity, price);
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const processPayment = async (req, res) => {
  const { order_id, amount, payment_method, transaction_id } = req.body;
  try {
    const [result] = await orderService.processPayment(order_id, amount, payment_method, transaction_id);
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getUserOrders = async (req, res) => {
  try {
    const [orders] = await orderService.getUserOrders(req.params.user_id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const [order, items, payment] = await orderService.getOrderDetail(req.params.order_id);
    res.json({ order: order[0], items, payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateOrderStatus = async (req, res) => {
  const { order_id, status } = req.body;
  try {
    const [result] = await orderService.updateOrderStatus(order_id, status);
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const subtractStockBulk = async (req, res) => {
  try {
    const products = req.body;

    const response = await axios.post('http://44.205.201.108:3000/products/stock/subtract-bulk', products);

    res.status(200).json({
      message: 'Stock actualizado correctamente',
      result: response.data
    });
  } catch (error) {
    console.error('Error al restar stock en bulk:', error.message);
    res.status(500).json({ error: 'Error al restar stock de productos' });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const [result] = await orderService.cancelOrder(req.params.order_id);
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  addOrderItem,
  processPayment,
  getUserOrders,
  getOrderDetail,
  updateOrderStatus,
  cancelOrder,
  subtractStockBulk
};
