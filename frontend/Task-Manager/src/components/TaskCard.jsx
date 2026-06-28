import { FiCalendar, FiClock, FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  formatDate,
  getPriorityStyles,
  getStatusStyles,
} from "../utils/helpers";

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <article className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-tight text-zinc-900 transition-colors duration-200 group-hover:text-zinc-700">
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
              {task.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityStyles(task.priority)}`}
            >
              {task.priority}
            </span>
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusStyles(task.status)}`}
            >
              {task.status}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <FiCalendar className="h-3.5 w-3.5" />
              Due: {formatDate(task.dueDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FiClock className="h-3.5 w-3.5" />
              Created: {formatDate(task.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:flex-col lg:flex-row">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 sm:flex-none"
            aria-label={`Edit ${task.title}`}
          >
            <FiEdit2 className="h-4 w-4" />
            <span className="sm:inline">Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 sm:flex-none"
            aria-label={`Delete ${task.title}`}
          >
            <FiTrash2 className="h-4 w-4" />
            <span className="sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
