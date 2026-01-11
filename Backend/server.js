const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:5500', 'http://localhost:3000', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
  }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Atlas Connection
async function connectMongoDB() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        
        // Get MongoDB URI from environment variable
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI) {
            console.error('MONGODB_URI is not defined in environment variables');
            throw new Error('MongoDB URI is missing');
        }
        
        // Connect to MongoDB Atlas
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ MongoDB Atlas Connected Successfully!');
        console.log('Database:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        
        return true;
    } catch (error) {
        console.error('❌ MongoDB Atlas Connection Failed:', error.message);
        
        // Fallback to local MongoDB
        try {
            console.log('Trying local MongoDB as fallback...');
            const localURI = 'mongodb://127.0.0.1:27017/hamza-fitness-club';
            await mongoose.connect(localURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000
            });
            console.log('✅ Connected to local MongoDB');
            return true;
        } catch (localError) {
            console.log('⚠️  Starting in simulated mode');
            return false;
        }
    }
}
app.options('*', cors());
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
    const mongoConnected = await connectMongoDB();
    
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
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📚 API Documentation: http://localhost:${PORT}/`);
        console.log(`❤️  Health check: http://localhost:${PORT}/health`);
        console.log(`💾 Database Status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    });
}

startServer();