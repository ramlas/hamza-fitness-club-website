const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load .env file with explicit path
const dotenv = require('dotenv');
const envPath = path.join(__dirname, '.env');

console.log('Loading environment from:', envPath);

const envResult = dotenv.config({ path: envPath });
if (envResult.error) {
    console.error('Error loading .env file:', envResult.error);
    console.log('Using default values or falling back to local database');
} else {
    console.log('.env file loaded successfully');
    console.log('PORT:', process.env.PORT || 'Not set');
    console.log('MONGODB_URI loaded:', process.env.MONGODB_URI ? 'Yes' : 'No');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5502',    // ← ADD THIS (VS Code Live Server)
        'http://127.0.0.1:5502',    // ← ADD THIS
        'http://localhost:8000',
        'http://127.0.0.1:8000',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ],
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
        console.log('\nConnecting to MongoDB Atlas...');
        
        // Use your actual cluster name: yv2tvyq (with q)
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://fa23bse158_db_user:fa23bse158_mernapi@gym-cluster.yv2tvyq.mongodb.net/hamza-fitness-club?retryWrites=true&w=majority&appName=gym-cluster';
        
        console.log('Using cluster: gym-cluster.yv2tvyq.mongodb.net');
        
        // Connect to MongoDB Atlas
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        });
        
        console.log('MongoDB Atlas Connected Successfully!');
        console.log('Database:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        
        return true;
    } catch (error) {
        console.error('MongoDB Atlas Connection Failed:', error.message);
        console.log('Trying local MongoDB as fallback...');
        
        // Fallback to local MongoDB
        try {
            const localURI = 'mongodb://127.0.0.1:27017/hamza-fitness-club';
            await mongoose.connect(localURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000
            });
            console.log('Connected to local MongoDB');
            console.log('Database:', mongoose.connection.name);
            return true;
        } catch (localError) {
            console.log('Starting in simulated mode - No database connection');
            return false;
        }
    }
}

// Enable pre-flight requests
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
        databaseName: mongoose.connection.name || 'Not connected',
        databaseHost: mongoose.connection.host || 'Not connected',
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
        database: {
            status: statusMap[dbStatus] || 'Unknown',
            name: mongoose.connection.name || 'Not connected',
            host: mongoose.connection.host || 'Not connected',
            readyState: dbStatus,
            isAtlas: mongoose.connection.host && mongoose.connection.host.includes('mongodb.net') ? true : false
        },
        server: {
            uptime: process.uptime(),
            port: PORT,
            environment: process.env.NODE_ENV || 'development'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path,
        method: req.method
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
        timestamp: new Date().toISOString()
    });
});

// Start server with MongoDB check
async function startServer() {
    const mongoConnected = await connectMongoDB();
    
    if (!mongoConnected) {
        console.log('Starting server with simulated database mode');
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
        console.log(`\nServer running on http://localhost:${PORT}`);
        console.log(`API Documentation: http://localhost:${PORT}/`);
        console.log(`Health check: http://localhost:${PORT}/health`);
        console.log(`Database Status: ${mongoose.connection.readyState === 1 ? 'Connected to ' + mongoose.connection.name : 'Disconnected'}`);
        console.log(`Database Host: ${mongoose.connection.host || 'Local'}`);
        console.log(`Database Type: ${mongoose.connection.host && mongoose.connection.host.includes('mongodb.net') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
    });
}

startServer();