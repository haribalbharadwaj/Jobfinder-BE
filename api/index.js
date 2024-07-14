const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('../src/routes/user');
const jobRoutes = require('../src/routes/job');
const errorHandler = require('../src/middleware/errorHandler');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/job', jobRoutes);
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send({
        status: "Server is up",
        now: new Date().toLocaleDateString()
    });
});

let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;
    }
    try {
        const client = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        cachedDb = client;
        return cachedDb;
    } catch (error) {
        console.error("Database connection error:", error);
        throw new Error("Database connection error");
    }
};

const handler = async (req, res) => {
    try {
        await connectToDatabase();
        app(req, res);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

module.exports = handler;
