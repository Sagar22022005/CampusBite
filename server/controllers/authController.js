import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'campusbite_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, hostel, roomNumber } = req.body;

    if (!email || !name || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Strict domain check: only @iiti.ac.in allowed
    const emailRegex = /^[a-zA-Z0-9._%+-]+@iiti\.ac\.in$/;
    if (!emailRegex.test(email.toLowerCase().trim())) {
      return res.status(400).json({
        message: 'Registration failed: Only @iiti.ac.in email addresses are accepted.',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const assignedRole = role || 'customer';
    const status =
      assignedRole === 'customer' || assignedRole === 'admin'
        ? 'approved'
        : 'pending';

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      password,
      role: assignedRole,
      status,
      hostel: hostel || 'APJ',
      roomNumber: roomNumber || '',
    });

    if (user.status === 'pending') {
      return res.status(201).json({
        message:
          'Registration submitted successfully! Your account is currently pending Admin approval before you can log in.',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        requiresApproval: true,
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account registered successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        hostel: user.hostel,
        roomNumber: user.roomNumber,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during signup' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check approval status for shop owners & delivery partners
    if (user.status === 'pending') {
      return res.status(403).json({
        message:
          '⏳ Your account is pending Admin approval. Please contact the CampusBite Admin or wait for approval.',
        status: 'pending',
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({
        message:
          '❌ Your registration application has been rejected by the administrator.',
        status: 'rejected',
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        hostel: user.hostel,
        roomNumber: user.roomNumber,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.hostel = req.body.hostel || user.hostel;
    user.roomNumber = req.body.roomNumber !== undefined ? req.body.roomNumber : user.roomNumber;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      status: updatedUser.status,
      hostel: updatedUser.hostel,
      roomNumber: updatedUser.roomNumber,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
