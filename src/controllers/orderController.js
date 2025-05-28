const orderService = require('../services/orderService');
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
  const { order_id, items } = req.body;

  try {
    const stockUpdatePayload = [];

    for (const item of items) {
      const { product_id, product_name, quantity, price } = item;

      await orderService.addOrderItem(order_id, product_id, product_name, quantity, price);
     
      stockUpdatePayload.push({
        id: product_id,
        newStock: quantity
      });
    }

    // Envía la actualización de stock
    await axios.post('http://44.205.201.108:3000/products/stock/add-bulk', stockUpdatePayload);

    res.json({ message: 'Items agregados y stock actualizado' });
  } catch (error) {
    console.error('Error al agregar ítems o actualizar stock:', error.message);
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
  cancelOrder
};
