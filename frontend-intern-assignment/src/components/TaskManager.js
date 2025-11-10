import React, { useState, useEffect } from "react";
import { tasksAPI } from "../services/api";
import "./TaskManager.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks(filters);
      setTasks(response.data.data.tasks);
    } catch (error) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: "",
    });
    setEditingTask(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      if (editingTask) {
        await tasksAPI.updateTask(editingTask._id, formData);
        setSuccess("Task updated successfully!");
      } else {
        await tasksAPI.createTask(formData);
        setSuccess("Task created successfully!");
      }

      resetForm();
      loadTasks();
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await tasksAPI.deleteTask(taskId);
        setSuccess("Task deleted successfully!");
        loadTasks();
      } catch (error) {
        setError("Failed to delete task");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "badge-pending",
      "in-progress": "badge-in-progress",
      completed: "badge-completed",
    };
    return `status-badge ${statusClasses[status]}`;
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      low: "badge-low",
      medium: "badge-medium",
      high: "badge-high",
    };
    return `priority-badge ${priorityClasses[priority]}`;
  };

  return (
    <div className="task-manager">
      <div className="task-header">
        <h2>Task Manager</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          Add New Task
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Filters */}
      <div className="filters">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="task-form-overlay">
          <div className="task-form">
            <h3>{editingTask ? "Edit Task" : "Create New Task"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="tasks-list">
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="no-tasks">
            No tasks found. Create your first task!
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <h4>{task.title}</h4>
                <div className="task-actions">
                  <button className="btn-edit" onClick={() => handleEdit(task)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {task.description && (
                <p className="task-description">{task.description}</p>
              )}

              <div className="task-meta">
                <span className={getStatusBadge(task.status)}>
                  {task.status}
                </span>
                <span className={getPriorityBadge(task.priority)}>
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span className="task-due">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="task-footer">
                <small>
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;
