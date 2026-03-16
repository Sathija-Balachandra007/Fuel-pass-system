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

// Mount routes
app.use('/auth', authRoutes);
app.use('/vehicle', vehicleRoutes);
app.use('/fuelpass', fuelpassRoutes);
app.use('/transaction', transactionRoutes);

// Default route to check server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).send('Route not found');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
