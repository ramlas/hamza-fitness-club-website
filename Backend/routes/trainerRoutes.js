const express = require('express');
const router = express.Router();
const {
  getTrainers,
  getTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer
} = require('../controllers/trainerController');

// GET /api/trainers
router.get('/', getTrainers);

// GET /api/trainers/:id
router.get('/:id', getTrainer);

// POST /api/trainers
router.post('/', createTrainer);

// PUT /api/trainers/:id
router.put('/:id', updateTrainer);

// DELETE /api/trainers/:id
router.delete('/:id', deleteTrainer);

module.exports = router;