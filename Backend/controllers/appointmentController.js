const Appointment = require('../models/Appointment');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Public
function calculateEndTime(startTime) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endMinutes = (hours * 60 + minutes + 30) % 1440;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
}

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('member', 'firstName lastName email')
      .populate('trainer', 'name specialization')
      .sort({ appointmentDate: -1, startTime: -1 });
    
    res.status(200).json({
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
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Public
const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('member', 'firstName lastName email phone')
      .populate('trainer', 'name specialization hourlyRate');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res) => {
  try {
    // Create appointment directly from form data
    const appointment = await Appointment.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      appointmentDate: req.body.date, // Match form field name
      startTime: req.body.time,
      endTime: calculateEndTime(req.body.time), // You need to calculate this
      concerns: req.body.concerns || [],
      notes: req.body.notes || '',
      serviceType: 'Free Consultation',
      status: 'Scheduled',
      amount: 0,
      duration: 30
    });
    
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Public
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('member', 'firstName lastName')
     .populate('trainer', 'name');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Public
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment
};