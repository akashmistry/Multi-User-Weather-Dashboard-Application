require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');

const PORT = process.env.PORT;
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Express Server is running on port ${PORT}`);
    });

    const gracefulShutdown = () => {
      server.close(async () => {
        console.log('HTTP server closed');
        try {
          await mongoose.connection.close();
          console.log('MongoDB connection closed');
        } catch (err) {
          console.error('Error closing MongoDB:', err);
        }
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
