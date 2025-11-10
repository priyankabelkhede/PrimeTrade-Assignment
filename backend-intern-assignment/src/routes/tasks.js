const express = require("express");
const { body } = require("express-validator");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasks");
const { protect } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validation");

const router = express.Router();

// All routes are protected
router.use(protect);

router.get("/", getTasks);

router.get("/:id", getTask);

router.post(
  "/",
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("status")
      .optional()
      .isIn(["pending", "in-progress", "completed"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority"),
  ],
  handleValidationErrors,
  createTask
);

router.put(
  "/:id",
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("status")
      .optional()
      .isIn(["pending", "in-progress", "completed"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority"),
  ],
  handleValidationErrors,
  updateTask
);

router.delete("/:id", deleteTask);

module.exports = router;
