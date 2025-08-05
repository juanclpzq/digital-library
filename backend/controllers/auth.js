const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateToken, generateRefreshToken } = require("../middleware/auth");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email",
    });
  }

  // Create user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
  });

  if (user) {
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        token,
        refreshToken,
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid user data",
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.isActive) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Update last login
  user.lastLogin = new Date();
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        theme: user.theme,
        lastLogin: user.lastLogin,
      },
      token,
      refreshToken,
    },
  });
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token is required",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, theme } = req.body;

  const user = await User.findById(req.user._id);

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (theme) user.theme = theme;

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.refreshToken = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = {
  register,
  login,
  refreshToken,
  getMe,
  updateProfile,
  logout,
};
