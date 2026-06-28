import mongoose from "mongoose";
import Task from "../models/Task.js";
import { AppError } from "../middleware/errorHandler.js";

const VALID_STATUSES = ["Pending", "In Progress", "Completed"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];
const VALID_SORT_OPTIONS = ["newest", "oldest", "priority", "dueDate"];

const PRIORITY_ORDER = { High: 1, Medium: 2, Low: 3 };

/**
 * Validate task body fields for create/update operations.
 * Returns an error message string or null if valid.
 */
const validateTaskBody = (body, isUpdate = false) => {
  if (!isUpdate) {
    if (!body.title || !String(body.title).trim()) {
      return "Title is required";
    }
  }

  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (!title) {
      return "Title is required";
    }
    if (title.length < 3) {
      return "Title must be at least 3 characters";
    }
    if (title.length > 100) {
      return "Title cannot exceed 100 characters";
    }
  }

  if (body.description !== undefined && body.description !== null) {
    if (String(body.description).length > 500) {
      return "Description cannot exceed 500 characters";
    }
  }

  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
    return "Invalid status value. Must be one of: Pending, In Progress, Completed";
  }

  if (body.priority !== undefined && !VALID_PRIORITIES.includes(body.priority)) {
    return "Invalid priority value. Must be one of: Low, Medium, High";
  }

  if (body.dueDate !== undefined && body.dueDate !== null && body.dueDate !== "") {
    const parsedDate = new Date(body.dueDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid due date format";
    }
  }

  return null;
};

/**
 * Build MongoDB filter from query parameters.
 */
const buildTaskFilter = (query) => {
  const filter = {};

  if (query.search) {
    filter.title = { $regex: query.search, $options: "i" };
  }

  if (query.status) {
    if (!VALID_STATUSES.includes(query.status)) {
      throw new AppError(
        "Invalid status value. Must be one of: Pending, In Progress, Completed",
        400
      );
    }
    filter.status = query.status;
  }

  if (query.priority) {
    if (!VALID_PRIORITIES.includes(query.priority)) {
      throw new AppError(
        "Invalid priority value. Must be one of: Low, Medium, High",
        400
      );
    }
    filter.priority = query.priority;
  }

  return filter;
};

/**
 * Resolve sort configuration from query parameter.
 */
const resolveSortOption = (sort) => {
  const sortBy = sort || "newest";

  if (!VALID_SORT_OPTIONS.includes(sortBy)) {
    throw new AppError(
      "Invalid sort value. Must be one of: newest, oldest, priority, dueDate",
      400
    );
  }

  switch (sortBy) {
    case "oldest":
      return { createdAt: 1 };
    case "priority":
      return { prioritySort: 1, createdAt: -1 };
    case "dueDate":
      return { dueDate: 1, createdAt: -1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
};

/**
 * GET /api/tasks
 * Fetch all tasks with optional search, filter, and sort.
 */
export const getAllTasks = async (req, res, next) => {
  try {
    const filter = buildTaskFilter(req.query);
    const sortOption = resolveSortOption(req.query.sort);

    let tasks;

    // Priority sort requires a computed field via aggregation
    if (req.query.sort === "priority") {
      tasks = await Task.aggregate([
        { $match: filter },
        {
          $addFields: {
            prioritySort: {
              $switch: {
                branches: [
                  { case: { $eq: ["$priority", "High"] }, then: PRIORITY_ORDER.High },
                  { case: { $eq: ["$priority", "Medium"] }, then: PRIORITY_ORDER.Medium },
                  { case: { $eq: ["$priority", "Low"] }, then: PRIORITY_ORDER.Low },
                ],
                default: 4,
              },
            },
          },
        },
        { $sort: sortOption },
        { $project: { prioritySort: 0 } },
      ]);
    } else {
      tasks = await Task.find(filter).sort(sortOption).lean();
    }

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/:id
 * Fetch a single task by ID.
 */
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid task ID", 400);
    }

    const task = await Task.findById(id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tasks
 * Create a new task.
 */
export const createTask = async (req, res, next) => {
  try {
    const validationError = validateTaskBody(req.body);

    if (validationError) {
      throw new AppError(validationError, 400);
    }

    const task = await Task.create({
      title: String(req.body.title).trim(),
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate || undefined,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tasks/:id
 * Update an existing task.
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid task ID", 400);
    }

    const validationError = validateTaskBody(req.body, true);

    if (validationError) {
      throw new AppError(validationError, 400);
    }

    const updateData = {};

    if (req.body.title !== undefined) {
      updateData.title = String(req.body.title).trim();
    }
    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }
    if (req.body.status !== undefined) {
      updateData.status = req.body.status;
    }
    if (req.body.priority !== undefined) {
      updateData.priority = req.body.priority;
    }
    if (req.body.dueDate !== undefined) {
      updateData.dueDate = req.body.dueDate || null;
    }

    const task = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete a task by ID.
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid task ID", 400);
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
