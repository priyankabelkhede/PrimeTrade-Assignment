const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  getMe,
  updateProfile,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validation");

const router = express.Router();

router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  handleValidationErrors,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  handleValidationErrors,
  login
);

router.get("/me", protect, getMe);

router.put(
  "/profile",
  protect,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please provide a valid email"),
  ],
  handleValidationErrors,
  updateProfile
);

module.exports = router;
