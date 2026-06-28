export const PRIORITIES = ["Low", "Medium", "High"];

export const STATUSES = ["Pending", "In Progress", "Completed"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "priority", label: "Priority" },
  { value: "dueDate", label: "Due Date" },
];

export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const formatDate = (dateString) => {
  if (!dateString) return "No due date";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const toInputDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
};

export const formatTodayDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const getPriorityStyles = (priority) => {
  const styles = {
    Low: "bg-zinc-100 text-zinc-700 ring-zinc-200",
    Medium: "bg-amber-50 text-amber-700 ring-amber-200",
    High: "bg-red-50 text-red-700 ring-red-200",
  };
  return styles[priority] ?? styles.Low;
};

export const getStatusStyles = (status) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    "In Progress": "bg-blue-50 text-blue-700 ring-blue-200",
    Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };
  return styles[status] ?? styles.Pending;
};

const PRIORITY_WEIGHT = { High: 3, Medium: 2, Low: 1 };

export const filterTasks = (tasks, { searchQuery, statusFilter, priorityFilter }) => {
  const query = searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesSearch =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });
};

export const sortTasks = (tasks, sortBy) => {
  const sorted = [...tasks];

  switch (sortBy) {
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    case "priority":
      return sorted.sort(
        (a, b) =>
          (PRIORITY_WEIGHT[b.priority] ?? 0) - (PRIORITY_WEIGHT[a.priority] ?? 0)
      );
    case "dueDate":
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case "newest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  }
};

export const countTasksByStatus = (tasks) => ({
  total: tasks.length,
  pending: tasks.filter((t) => t.status === "Pending").length,
  inProgress: tasks.filter((t) => t.status === "In Progress").length,
  completed: tasks.filter((t) => t.status === "Completed").length,
});

export const getEmptyFormState = () => ({
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
});
