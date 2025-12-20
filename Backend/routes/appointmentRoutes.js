const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

// GET /api/appointments
router.get('/', getAppointments);

// GET /api/appointments/:id
router.get('/:id', getAppointment);

// POST /api/appointments
router.post('/', createAppointment);

// PUT /api/appointments/:id
router.put('/:id', updateAppointment);

// DELETE /api/appointments/:id
router.delete('/:id', deleteAppointment);

module.exports = router;