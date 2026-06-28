import { FiSearch } from "react-icons/fi";

const SearchBar = ({ value, onChange, placeholder = "Search tasks...", disabled = false }) => {
  return (
    <div className="relative w-full min-w-0">
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors duration-200 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Search tasks"
      />
    </div>
  );
};

export default SearchBar;
