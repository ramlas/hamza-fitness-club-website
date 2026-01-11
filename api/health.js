// /api/health.js - Enhanced with cluster monitoring
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://fa23bse158_db_user:fa23bse158_mernapi@gym-cluster.yv2tvyq.mongodb.net/hamza-fitness-club?retryWrites=true&w=majority&appName=gym-cluster';
const DB_NAME = 'hamza-fitness-club';

async function checkMongoDBCluster() {
  const startTime = Date.now();
  
  try {
    const client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    
    const db = client.db(DB_NAME);
    
    // Get cluster info
    const adminDb = client.db().admin();
    const serverInfo = await adminDb.serverInfo();
    const pingResult = await db.command({ ping: 1 });
    
    // Get database stats
    const stats = await db.stats();
    
    // Get appointment count
    const appointmentsCount = await db.collection('appointments').countDocuments();
    
    client.close();
    
    const endTime = Date.now();
    const latency = endTime - startTime;
    
    return {
      status: 'connected',
      cluster: {
        name: serverInfo.gitVersion ? 'MongoDB Atlas' : 'Unknown',
        version: serverInfo.version,
        host: serverInfo.host,
        process: serverInfo.process,
        latency: `${latency}ms`
      },
      database: {
        name: DB_NAME,
        collections: stats.collections,
        documents: stats.objects,
        size: `${Math.round(stats.dataSize / 1024 / 1024)}MB`,
        storageSize: `${Math.round(stats.storageSize / 1024 / 1024)}MB`,
        indexes: stats.indexes,
        indexSize: `${Math.round(stats.indexSize / 1024 / 1024)}MB`
      },
      collections: {
        appointments: appointmentsCount
      },
      message: 'MongoDB Atlas cluster connected successfully'
    };
    
  } catch (error) {
    return {
      status: 'disconnected',
      error: error.message,
      cluster: {
        uriUsed: MONGODB_URI.includes('@gym-cluster') ? 'Correct cluster' : 'Wrong cluster',
        clusterName: 'gym-cluster.yv2tvyq.mongodb.net'
      },
      message: `MongoDB Atlas connection failed: ${error.message}`
    };
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Check MongoDB Atlas cluster
    const dbStatus = await checkMongoDBCluster();
    
    // Get system info
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
      },
      uptime: `${Math.round(process.uptime())} seconds`,
      environment: process.env.NODE_ENV || 'development'
    };
    
    res.status(200).json({
      status: dbStatus.status === 'connected' ? 'OK' : 'WARNING',
      timestamp: new Date().toISOString(),
      service: 'Hamza Fitness Club API',
      version: '2.0.0',
      mode: 'vercel-production',
      
      database: dbStatus,
      system: systemInfo,
      
      endpoints: {
        health: '/api/health',
        bookAppointment: 'POST /api',
        getAppointments: 'GET /api',
        localBackend: 'http://localhost:3000/api/appointments'
      },
      
      instructions: {
        booking: 'Send POST request to /api with appointment data',
        test: 'Visit /api/health to check cluster connection',
        support: 'Contact: +92 305 7050399'
      }
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message,
      message: 'Health check failed',
      emergencyContact: '+92 305 7050399'
    });
  }
}