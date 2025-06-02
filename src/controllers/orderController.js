const orderService = require('../services/orderService');

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
  try {
    const { order_id, amount, payment_method, transaction_id } = req.body;

    // 1. Guardar la orden con estado 'pendiente' (ya lo haces)
    await savePendingOrder(order_id, amount, payment_method, transaction_id);

    // 2. Llamar al servicio de pagos
    const paymentResponse = await axios.post('http://localhost:3000/payment', {
      order_id,
      amount,
      payment_method,
      transaction_id
    });

    // 3. Devolver respuesta al cliente
    res.status(200).json({
      message: 'Orden pendiente y pago enviado',
      payment_id: paymentResponse.data.payment_id
    });

  } catch (error) {
    console.error('Error al procesar pago desde orders:', error);
    res.status(500).json({ error: 'Error en el procesamiento de la orden' });
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

async function updateOrderStatus(req, res) {
  try {
    const { order_id, new_status } = req.body;

    // 1. Actualizar el estado de la orden en la base de datos
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [new_status, order_id]);

    // 2. Si el nuevo estado es 'completado', entonces restar stock
    if (new_status === 'completado') {
      // 3. Obtener productos y cantidades de la orden
      const [products] = await db.query(
        `SELECT product_id as id, quantity FROM order_products WHERE order_id = ?`,
        [order_id]
      );

      // 4. Llamar a /products/stock/subtract-bulk para restar el stock
      await axios.post('http://44.205.201.108:3000/products/stock/subtract-bulk', products);
    }

    res.status(200).json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado de la orden' });
  }
}

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
