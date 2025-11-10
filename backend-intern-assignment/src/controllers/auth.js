const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { successResponse, errorResponse } = require("../utils/response");

exports.register = async (req, res, next) => {
  try {
    console.log("📝 Registration attempt:", req.body);

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log("🔍 Existing user check:", existingUser);

    if (existingUser) {
      return errorResponse(res, "User already exists with this email", 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });
    console.log("User created successfully:", user.email);

    // Generate token
    const token = generateToken({ id: user._id });

    // Remove password from output
    user.password = undefined;

    successResponse(
      res,
      "User registered successfully",
      {
        user,
        token,
      },
      201
    );
  } catch (error) {
    console.log("Registration error:", error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Generate token
    const token = generateToken({ id: user._id });

    // Remove password from output
    user.password = undefined;

    successResponse(res, "Login successful", {
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    successResponse(res, "User profile retrieved successfully", { user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    if (req.body.name) fieldsToUpdate.name = req.body.name;
    if (req.body.email) fieldsToUpdate.email = req.body.email;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    successResponse(res, "Profile updated successfully", { user });
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, "Email already exists", 400);
    }
    next(error);
  }
};
