const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicle');
const fuelpassRoutes = require('./routes/fuelpass');
const transactionRoutes = require('./routes/transaction');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/vehicle', vehicleRoutes);
app.use('/fuelpass', fuelpassRoutes);
app.use('/transaction', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
