const taskService = require("../services/taskService");

const sendResponse = (res, statusCode, data, message) => {
  res.status(statusCode).json({ success: statusCode < 400, message, data });
};

exports.getAllTasks = (req, res, next) => {
  try {
    const tasks = taskService.getAllTasks();
    sendResponse(res, 200, tasks, "Tasks fetched successfully");
  } catch (err) { next(err); }
};

exports.getTaskById = (req, res, next) => {
  try {
    const task = taskService.getTaskById(req.params.id);
    if (!task) return sendResponse(res, 404, null, "Task not found");
    sendResponse(res, 200, task, "Task fetched successfully");
  } catch (err) { next(err); }
};

exports.createTask = (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) return sendResponse(res, 400, null, "Title is required");
    const newTask = taskService.createTask({ title, description });
    sendResponse(res, 201, newTask, "Task created successfully");
  } catch (err) { next(err); }
};

exports.updateTask = (req, res, next) => {
  try {
    const updatedTask = taskService.updateTask(req.params.id, req.body);
    if (!updatedTask) return sendResponse(res, 404, null, "Task not found");
    sendResponse(res, 200, updatedTask, "Task updated successfully");
  } catch (err) { next(err); }
};

exports.deleteTask = (req, res, next) => {
  try {
    const deleted = taskService.deleteTask(req.params.id);
    if (!deleted) return sendResponse(res, 404, null, "Task not found");
    sendResponse(res, 200, null, "Task deleted successfully");
  } catch (err) { next(err); }
};