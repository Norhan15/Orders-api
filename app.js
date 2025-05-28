const express = require('express');
const dotenv = require('dotenv');
const orderRoutes = require('./src/routes/orderRoutes');
const app = express();

dotenv.config();
app.use(express.json());
app.use('/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
