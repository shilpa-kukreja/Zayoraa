"use client";
import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiBell,
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = ({ setToken }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const router = useRouter();

  // Load theme preference
  useEffect(() => {
    const theme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setDarkMode(theme === "dark");
  }, []);

  // Apply theme styles
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.style.setProperty("--nav-bg", "#1e293b");
      root.style.setProperty("--bg-color", "#0f172a");
      root.style.setProperty("--text-color", "#f8fafc");
      root.style.setProperty("--border-color", "#334155");
      root.style.setProperty("--hover-color", "#334155");
      root.style.setProperty("--dropdown-bg", "#1e293b");
      root.style.setProperty("--dropdown-hover", "#334155");
      localStorage.setItem("theme", "dark");
    } else {
      root.style.setProperty("--nav-bg", "#ffffff");
      root.style.setProperty("--bg-color", "#f8fafc");
      root.style.setProperty("--text-color", "#0f172a");
      root.style.setProperty("--border-color", "#e2e8f0");
      root.style.setProperty("--hover-color", "#f1f5f9");
      root.style.setProperty("--dropdown-bg", "#ffffff");
      root.style.setProperty("--dropdown-hover", "#f1f5f9");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleTheme = () => setDarkMode(!darkMode);

  const handleNotificationClick = () => {
    setHasNotifications(false);
    // Placeholder: open a notification drawer/modal
    console.log("Open notification panel");
  };

  const handleInfoClick = () => router.push("/about");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--nav-bg)] backdrop-blur supports-backdrop-blur:bg-[var(--nav-bg)/70] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex px-4 items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/logo/logo.png"
                alt="Miraggiolife Logo"
                className="w-8  sm:w-20   transition-transform duration-300 group-hover:scale-110"
              />

            </Link>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search (mobile) */}
            {!showSearch && (
              <button
                onClick={() => setShowSearch(true)}
                className="md:hidden p-2 rounded-full hover:bg-[var(--hover-color)] text-[var(--text-color)]"
              >
                <FiSearch className="h-5 w-5" />
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--hover-color)] text-[var(--text-color)] transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>

            {/* Help */}
            <button
              onClick={handleInfoClick}
              className="p-2 rounded-full hover:bg-[var(--hover-color)] text-[var(--text-color)]"
              aria-label="Help and information"
            >
              <FiHelpCircle className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="p-2 rounded-full hover:bg-[var(--hover-color)] text-[var(--text-color)] relative"
                aria-label="Notifications"
              >
                <FiBell className="h-5 w-5" />
                {hasNotifications && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative ml-2">
              <button
                type="button"
                onClick={toggleDropdown}
                className="flex items-center rounded-full bg-[var(--hover-color)] px-2 py-1 text-sm transition hover:ring-2 hover:ring-indigo-500"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <FiUser className="h-4 w-4 text-white" />
                </div>
                <span className="ml-2 hidden sm:inline-block text-sm font-medium text-[var(--text-color)]">
                  Syuta
                </span>
                <svg
                  className={`ml-1 h-4 w-4 text-[var(--text-color)] transition-transform duration-200 ${showDropdown ? "rotate-180" : ""
                    }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {showDropdown && (
                <div
                  className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-[var(--dropdown-bg)] shadow-lg ring-1 ring-black ring-opacity-5 border border-[var(--border-color)] overflow-hidden"
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  {/* <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--dropdown-hover)] transition"
                    >
                      <FiUser className="mr-3 h-5 w-5 text-gray-400" />
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--dropdown-hover)] transition"
                    >
                      <FiSettings className="mr-3 h-5 w-5 text-gray-400" />
                      Settings
                    </Link>
                  </div> */}
                  <div className="border-t border-[var(--border-color)]">
                    <button
                      onClick={() => {
                        localStorage.removeItem("adminToken");
                        window.location.href = "/admin/login";
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <FiLogOut className="mr-3 h-5 w-5 text-red-500" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
