import { FiX } from "react-icons/fi";
import SearchBar from "./SearchBar";
import { PRIORITIES, SORT_OPTIONS, STATUSES } from "../utils/helpers";

const selectClassName =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 transition-colors duration-200 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200";

const FilterBar = ({
  searchQuery,
  statusFilter,
  priorityFilter,
  sortBy,
  onSearch,
  onStatusFilter,
  onPriorityFilter,
  onSort,
  onClearFilters,
  hasActiveFilters,
  disabled = false,
}) => {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4">
        <SearchBar value={searchQuery} onChange={onSearch} disabled={disabled} />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="status-filter"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => onStatusFilter(e.target.value)}
              disabled={disabled}
              className={selectClassName}
            >
              <option value="all">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="priority-filter"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
            >
              Priority
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => onPriorityFilter(e.target.value)}
              disabled={disabled}
              className={selectClassName}
            >
              <option value="all">All Priorities</option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sort-by"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
            >
              Sort By
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => onSort(e.target.value)}
              disabled={disabled}
              className={selectClassName}
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={onClearFilters}
              disabled={disabled || !hasActiveFilters}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiX className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterBar;
