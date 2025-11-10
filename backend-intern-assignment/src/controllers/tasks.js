const Task = require("../models/Task");
const { successResponse, errorResponse } = require("../utils/response");

exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const query = { createdBy: req.user.id };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const skip = (page - 1) * limit;
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "name email");

    const total = await Task.countDocuments(query);
    successResponse(res, "Tasks retrieved successfully", {
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    }).populate("createdBy", "name email");
    if (!task) return errorResponse(res, "Task not found", 404);
    successResponse(res, "Task retrieved successfully", { task });
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    console.log("📝 Creating task:", req.body);
    const taskData = { ...req.body, createdBy: req.user.id };
    const task = await Task.create(taskData);
    await task.populate("createdBy", "name email");
    successResponse(res, "Task created successfully", { task }, 201);
  } catch (error) {
    console.log("❌ Task creation error:", error);
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!task) return errorResponse(res, "Task not found", 404);
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");
    successResponse(res, "Task updated successfully", { task });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!task) return errorResponse(res, "Task not found", 404);
    await Task.findByIdAndDelete(req.params.id);
    successResponse(res, "Task deleted successfully");
  } catch (error) {
    next(error);
  }
};
