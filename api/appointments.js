// /api/appointments.js (at root)
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        message: 'GET not implemented on Vercel',
        data: []
      });
    }
    
    if (req.method === 'POST') {
      try {
        const appointment = req.body;
        
        // Basic validation
        if (!appointment.name || !appointment.email || !appointment.date || !appointment.time) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields'
          });
        }
        
        // Create appointment
        const newAppointment = {
          ...appointment,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: 'pending-vercel',
          bookingId: 'VERCEL-' + Date.now(),
          source: 'vercel-fallback'
        };
        
        // Log to Vercel console
        console.log('📅 Vercel Booking Received:', {
          name: newAppointment.name,
          date: newAppointment.date,
          time: newAppointment.time,
          email: newAppointment.email
        });
        
        // In production, you would save to database here
        // For now, return success
        
        return res.status(201).json({
          success: true,
          message: 'Booking received on Vercel! We will contact you soon.',
          data: newAppointment,
          note: 'This is a Vercel fallback. For full features, run locally.'
        });
        
      } catch (error) {
        console.error('Vercel API Error:', error);
        return res.status(500).json({
          success: false,
          error: 'Server error on Vercel'
        });
      }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  }