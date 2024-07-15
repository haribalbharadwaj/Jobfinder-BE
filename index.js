const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/user');
const jobRoutes = require('./src/routes/job');
const errorHandler = require('./src/middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json()); // Use built-in express.json() instead of bodyParser
app.use('/user',userRoutes);
app.use('/job',jobRoutes);
app.use(errorHandler);

// Routes
app.get('/', (req, res) => {
    res.json({
        message:'Job listing API is working fine',
        status: "Server is up",
        now: new Date().toLocaleDateString()
    });
});

app.use("*", (req, res) => {
    res.status(404).json({
        message: 'Endpoint not found',
        status: 'Error',
    });
});

// Database connection
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });