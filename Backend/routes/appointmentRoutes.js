// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Create new appointment
router.post('/', async (req, res) => {
    try {
        console.log('📝 Creating appointment:', req.body);
        
        const appointment = new Appointment({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            date: req.body.date,
            time: req.body.time,
            concerns: req.body.concerns || [],
            notes: req.body.notes || '',
            status: 'pending'
        });

        await appointment.save();
        
        console.log('✅ Appointment saved:', appointment._id);
        
        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: appointment
        });
        
    } catch (error) {
        console.error('❌ Appointment creation error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to book appointment'
        });
    }
});

// Get all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ date: 1, time: 1 });
        res.json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;