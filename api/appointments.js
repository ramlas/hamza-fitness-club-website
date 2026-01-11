// /api/appointments.js - Optimized for MongoDB Atlas Cluster
import { MongoClient } from 'mongodb';

// MongoDB Atlas Cluster connection string from your .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://fa23bse158_db_user:fa23bse158_mernapi@gym-cluster.yv2tvyq.mongodb.net/hamza-fitness-club?retryWrites=true&w=majority&appName=gym-cluster';
const DB_NAME = 'hamza-fitness-club';

// Connection caching for serverless environment
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    console.log('📊 Using cached MongoDB connection');
    return { client: cachedClient, db: cachedDb };
  }
  
  console.log('🔌 Creating new MongoDB Atlas connection...');
  console.log('Cluster: gym-cluster.yv2tvyq.mongodb.net');
  console.log('Database: hamza-fitness-club');
  
  try {
    const client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Connection pool size
      serverSelectionTimeoutMS: 15000, // 15 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    
    const db = client.db(DB_NAME);
    
    // Test connection
    await db.command({ ping: 1 });
    console.log('✅ MongoDB Atlas Cluster connected successfully');
    console.log('Host:', client.s.options.srvHost);
    console.log('Database:', db.databaseName);
    
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.error('Full error:', error);
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Connect to MongoDB Atlas cluster
    const { db } = await connectToDatabase();
    
    if (req.method === 'GET') {
      // Get all appointments
      const appointments = await db.collection('appointments')
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();
      
      return res.status(200).json({
        success: true,
        data: appointments,
        count: appointments.length,
        source: 'mongodb-atlas-cluster'
      });
    }
    
    if (req.method === 'POST') {
      const appointment = req.body;
      
      console.log('📥 Received booking request:', {
        name: appointment.name,
        email: appointment.email,
        date: appointment.date,
        time: appointment.time
      });
      
      // Enhanced validation
      const required = {
        name: 'Full name',
        email: 'Email address',
        phone: 'Phone number',
        date: 'Appointment date',
        time: 'Appointment time'
      };
      
      const missing = [];
      for (const [field, label] of Object.entries(required)) {
        if (!appointment[field] || appointment[field].trim() === '') {
          missing.push(label);
        }
      }
      
      if (missing.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Please provide: ${missing.join(', ')}`,
          missingFields: missing
        });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(appointment.email)) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a valid email address'
        });
      }
      
      // Create complete appointment document
      const newAppointment = {
        // User details
        name: appointment.name.trim(),
        email: appointment.email.trim().toLowerCase(),
        phone: appointment.phone.trim(),
        
        // Appointment details
        date: appointment.date,
        time: appointment.time,
        concerns: appointment.concerns || [],
        notes: appointment.notes || '',
        
        // System fields
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'confirmed',
        bookingId: `HFC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        source: 'vercel-booking-form',
        environment: 'production',
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
      };
      
      // Insert into MongoDB Atlas cluster
      console.log('💾 Saving to MongoDB Atlas cluster...');
      const result = await db.collection('appointments').insertOne(newAppointment);
      
      console.log('✅ MongoDB Atlas save successful:', {
        insertedId: result.insertedId,
        bookingId: newAppointment.bookingId,
        collection: 'appointments',
        database: DB_NAME
      });
      
      // Also save a backup in a separate collection
      try {
        await db.collection('booking_backups').insertOne({
          ...newAppointment,
          originalId: result.insertedId,
          backedUpAt: new Date()
        });
        console.log('📦 Backup saved to booking_backups collection');
      } catch (backupError) {
        console.warn('⚠️ Backup failed (non-critical):', backupError.message);
      }
      
      return res.status(201).json({
        success: true,
        message: 'Appointment booked successfully! We will contact you shortly.',
        data: {
          ...newAppointment,
          _id: result.insertedId,
          createdAt: newAppointment.createdAt.toISOString(),
          updatedAt: newAppointment.updatedAt.toISOString()
        },
        bookingDetails: {
          bookingId: newAppointment.bookingId,
          confirmation: `Your booking ID is ${newAppointment.bookingId}. Please save this for reference.`,
          nextSteps: 'We will send a confirmation email within 24 hours.',
          contactInfo: {
            phone: '+92 305 7050399',
            email: 'support@hamzafitnessclub.com'
          }
        }
      });
      
    }
    
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
    
  } catch (error) {
    console.error('❌ API Error:', error);
    
    // Different error handling based on error type
    if (error.name === 'MongoNetworkError' || error.message.includes('connect')) {
      return res.status(503).json({
        success: false,
        error: 'Database connection failed',
        message: 'Cannot connect to MongoDB Atlas cluster. Please try again later.',
        developerNote: 'Check MongoDB Atlas cluster status and network access'
      });
    }
    
    if (error.message.includes('validation')) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong. Please try again.' 
        : error.message,
      timestamp: new Date().toISOString()
    });
  }
}