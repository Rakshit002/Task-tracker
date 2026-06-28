import { FiClipboard, FiPlus } from "react-icons/fi";

const EmptyState = ({ onCreateTask, hasFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center shadow-sm">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-100">
        <FiClipboard className="h-10 w-10 text-zinc-400" />
      </div>

      <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-900">
        No Tasks Found
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
        {hasFilters
          ? "No tasks match your current search or filters. Try adjusting them or create a new task."
          : "You haven't created any tasks yet. Get started by adding your first task."}
      </p>

      {!hasFilters && (
        <button
          type="button"
          onClick={onCreateTask}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-zinc-800 hover:shadow-md"
        >
          <FiPlus className="h-4 w-4" />
          Create First Task
        </button>
      )}
    </div>
  );
};

export default EmptyState;
