import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FiCheckSquare } from "react-icons/fi";
import { formatTodayDate } from "../utils/helpers";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm transition-transform duration-200 hover:scale-105">
            <FiCheckSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">
              Task Tracker
            </h1>
            <p className="hidden text-xs text-zinc-500 sm:block">
              Stay organized, stay productive
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 md:flex">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Today
          </span>
          <span className="text-sm font-medium text-zinc-700">
            {formatTodayDate()}
          </span>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors duration-200 hover:bg-zinc-50 md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 md:hidden">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Today
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-700">
              {formatTodayDate()}
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
