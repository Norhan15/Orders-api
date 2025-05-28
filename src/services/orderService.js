const { callProcedure } = require('../models/orderModel');

const createOrder = async (userId, total) => callProcedure('CreateOrder', [userId, total]);
const addOrderItem = async (orderId, productId, name, qty, price) => callProcedure('AddOrderItem', [orderId, productId, name, qty, price]);
const processPayment = async (orderId, amount, method, txId) => callProcedure('ProcessPayment', [orderId, amount, method, txId]);
const getUserOrders = async (userId) => callProcedure('GetUserOrders', [userId]);
const getOrderDetail = async (orderId) => callProcedure('GetOrderDetail', [orderId]);
const updateOrderStatus = async (orderId, status) => callProcedure('UpdateOrderStatus', [orderId, status]);
const cancelOrder = async (orderId) => callProcedure('CancelOrder', [orderId]);

module.exports = {
  createOrder,
  addOrderItem,
  processPayment,
  getUserOrders,
  getOrderDetail,
  updateOrderStatus,
  cancelOrder
};
