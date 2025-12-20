const express = require('express');
const router = express.Router();
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass
} = require('../controllers/classController');

// GET /api/classes
router.get('/', getClasses);

// GET /api/classes/:id
router.get('/:id', getClass);

// POST /api/classes
router.post('/', createClass);

// PUT /api/classes/:id
router.put('/:id', updateClass);

// DELETE /api/classes/:id
router.delete('/:id', deleteClass);

module.exports = router;