const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  getMe,
  updateProfile,
  logout,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");

// Validation rules
const registerValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.post("/refresh", refreshToken);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/logout", protect, logout);

module.exports = router;
