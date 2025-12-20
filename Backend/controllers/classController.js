const Class = require('../models/Class');
const Trainer = require('../models/Trainer');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('trainer', 'name specialization')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Public
const getClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate('trainer', 'name specialization experience bio');
    
    if (!classItem) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: classItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new class
// @route   POST /api/classes
// @access  Public
const createClass = async (req, res) => {
  try {
    // Check if trainer exists
    const trainer = await Trainer.findById(req.body.trainer);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found'
      });
    }
    
    const classItem = await Class.create(req.body);
    
    // Populate the created class
    const populatedClass = await Class.findById(classItem._id)
      .populate('trainer', 'name');
    
    res.status(201).json({
      success: true,
      data: populatedClass
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Public
const updateClass = async (req, res) => {
  try {
    const classItem = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('trainer', 'name');
    
    if (!classItem) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: classItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Public
const deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findByIdAndDelete(req.params.id);
    
    if (!classItem) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
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
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass
};