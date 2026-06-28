import { useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import {
  getEmptyFormState,
  PRIORITIES,
  STATUSES,
  toInputDate,
} from "../utils/helpers";

const inputClassName =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-zinc-900 transition-colors duration-200 focus:outline-none focus:ring-2";

const TaskForm = ({ onSubmit, editingTask, onCancelEdit, isSubmitting = false }) => {
  const [formData, setFormData] = useState(getEmptyFormState());
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(editingTask);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title ?? "",
        description: editingTask.description ?? "",
        priority: editingTask.priority ?? "Medium",
        status: editingTask.status ?? "Pending",
        dueDate: toInputDate(editingTask.dueDate),
      });
    } else {
      setFormData(getEmptyFormState());
    }
    setErrors({});
  }, [editingTask]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    try {
      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
      });

      if (!isEditing) {
        setFormData(getEmptyFormState());
      }
      setErrors({});
    } catch {
      // Error toast is handled in Home
    }
  };

  const handleCancel = () => {
    setFormData(getEmptyFormState());
    setErrors({});
    onCancelEdit?.();
  };

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          {isEditing ? "Edit Task" : "Add New Task"}
        </h2>
        {isEditing && (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Editing
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="task-title"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            value={formData.title}
            onChange={handleChange("title")}
            placeholder="Enter task title"
            className={`${inputClassName} ${
              errors.title
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200"
            }`}
          />
          {errors.title && (
            <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Description
          </label>
          <textarea
            id="task-description"
            value={formData.description}
            onChange={handleChange("description")}
            placeholder="Enter task description"
            rows={3}
            className={`${inputClassName} resize-none border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="task-priority"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Priority
            </label>
            <select
              id="task-priority"
              value={formData.priority}
              onChange={handleChange("priority")}
              className={`${inputClassName} border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200`}
            >
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="task-status"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Status
            </label>
            <select
              id="task-status"
              value={formData.status}
              onChange={handleChange("status")}
              className={`${inputClassName} border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200`}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="task-due-date"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Due Date
          </label>
          <input
            id="task-due-date"
            type="date"
            value={formData.dueDate}
            onChange={handleChange("dueDate")}
            className={`${inputClassName} border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200`}
          />
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors duration-200 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiX className="h-4 w-4" />
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-zinc-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiPlus className="h-4 w-4" />
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
                ? "Update Task"
                : "Add Task"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default TaskForm;
