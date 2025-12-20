const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember
} = require('../controllers/memberController');

// GET /api/members
router.get('/', getMembers);

// GET /api/members/:id
router.get('/:id', getMember);

// POST /api/members
router.post('/', createMember);

// PUT /api/members/:id
router.put('/:id', updateMember);

// DELETE /api/members/:id
router.delete('/:id', deleteMember);

module.exports = router;