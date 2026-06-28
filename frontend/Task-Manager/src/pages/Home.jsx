import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import DashboardCards from "../components/DashboardCards";
import DeleteModal from "../components/DeleteModal";
import EmptyState from "../components/EmptyState";
import FilterBar from "../components/FilterBar";
import LoadingSkeleton from "../components/LoadingSkeleton";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/api";
import { countTasksByStatus } from "../utils/helpers";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const formRef = useRef(null);
  const isInitialLoad = useRef(true);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const buildQueryParams = useCallback(() => {
    const params = { sort: sortBy };

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }

    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    if (priorityFilter !== "all") {
      params.priority = priorityFilter;
    }

    return params;
  }, [debouncedSearch, statusFilter, priorityFilter, sortBy]);

  const loadTasks = useCallback(async () => {
    const showFullSkeleton = isInitialLoad.current;

    if (showFullSkeleton) {
      setIsLoading(true);
    } else {
      setIsFetching(true);
    }

    try {
      const [filteredTasks, statsTasks] = await Promise.all([
        getTasks(buildQueryParams()),
        getTasks({ sort: "newest" }),
      ]);

      setTasks(filteredTasks);
      setAllTasks(statsTasks);
    } catch (error) {
      toast.error(error.message);

      if (showFullSkeleton) {
        setTasks([]);
        setAllTasks([]);
      }
    } finally {
      setIsLoading(false);
      setIsFetching(false);
      isInitialLoad.current = false;
    }
  }, [buildQueryParams]);

  // Fetch tasks when filters, search, or sort change
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const stats = useMemo(() => countTasksByStatus(allTasks), [allTasks]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    sortBy !== "newest";

  const handleAddTask = useCallback(
    async (formData) => {
      setIsSubmitting(true);

      try {
        if (editingTask) {
          await updateTask(editingTask.id, formData);
          setEditingTask(null);
          toast.success("Task updated successfully");
        } else {
          await createTask(formData);
          toast.success("Task added successfully");
        }

        await loadTasks();
      } catch (error) {
        toast.error(error.message);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingTask, loadTasks]
  );

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleDeleteTask = useCallback((task) => {
    setTaskToDelete(task);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!taskToDelete) return;

    setIsDeleting(true);

    try {
      await deleteTask(taskToDelete.id);

      if (editingTask?.id === taskToDelete.id) {
        setEditingTask(null);
      }

      toast.success("Task deleted successfully");
      setTaskToDelete(null);
      await loadTasks();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  }, [taskToDelete, editingTask, loadTasks]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleFilter = useCallback((type, value) => {
    if (type === "status") setStatusFilter(value);
    if (type === "priority") setPriorityFilter(value);
  }, []);

  const handleSort = useCallback((value) => {
    setSortBy(value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("newest");
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingTask(null);
  }, []);

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-8">
      <DashboardCards stats={stats} />

      <div ref={formRef}>
        <TaskForm
          onSubmit={handleAddTask}
          editingTask={editingTask}
          onCancelEdit={handleCancelEdit}
          isSubmitting={isSubmitting}
        />
      </div>

      <FilterBar
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        sortBy={sortBy}
        onSearch={handleSearch}
        onStatusFilter={(value) => handleFilter("status", value)}
        onPriorityFilter={(value) => handleFilter("priority", value)}
        onSort={handleSort}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        disabled={isFetching}
      />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
            Your Tasks
          </h2>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
            {tasks.length}{" "}
            {tasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            onCreateTask={scrollToForm}
            hasFilters={hasActiveFilters || allTasks.length > 0}
          />
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        )}
      </div>

      <DeleteModal
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Home;
