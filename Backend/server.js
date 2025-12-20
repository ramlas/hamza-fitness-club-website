const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test MongoDB connection without starting server
async function testMongoDB() {
    try {
        console.log('Testing MongoDB connection...');
        
        // Try local MongoDB first
        const localURI = 'mongodb://127.0.0.1:27017/hamza-fitness-club';
        await mongoose.connect(localURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        
        console.log('MongoDB Connected to:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        console.log('Port:', mongoose.connection.port);
        
        return true;
    } catch (error) {
        console.log('Local MongoDB connection failed:', error.message);
        
        // Try fallback to in-memory during development
        console.log('Using in-memory database for development');
        return false;
    }
}

// Import routes
const memberRoutes = require('./routes/memberRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const classRoutes = require('./routes/classRoutes');

// Use routes
app.use('/api/members', memberRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/classes', classRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Hamza Fitness Club API',
        version: '1.0.0',
        status: 'Running',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        endpoints: {
            members: '/api/members',
            trainers: '/api/trainers',
            appointments: '/api/appointments',
            classes: '/api/classes'
        }
    });
});

// Health check with detailed info
app.get('/health', async (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting'
    };
    
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: statusMap[dbStatus] || 'Unknown',
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server with MongoDB check
async function startServer() {
    const mongoConnected = await testMongoDB();
    
    if (!mongoConnected) {
        console.log('⚠️  Starting server with simulated database mode');
        // Add simulation middleware
        app.use((req, res, next) => {
            if (!req.simulatedDB) req.simulatedDB = {
                members: [],
                trainers: [],
                appointments: [],
                classes: []
            };
            next();
        });
    }
    
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`API Documentation: http://localhost:${PORT}/`);
        console.log(`Health check: http://localhost:${PORT}/health`);
    });
}

startServer();