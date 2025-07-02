"use client";

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseLink = "px-3 py-2 rounded-md font-medium text-gray-700 transition";
  const activeLink = "text-blue-700 font-semibold underline";
  const mobileBaseLink =
    "block px-3 py-2 rounded-md text-base font-medium text-gray-700 transition";
  const mobileActiveLink = "text-blue-700 font-semibold bg-blue-50";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SI</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Sama International
            </span>
            <span className="text-lg font-bold text-gray-900 sm:hidden">
              Sama
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Categories
            </NavLink>
            <NavLink
              to="/contact-us"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right-side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Shopping Cart */}
            <button className="p-2 text-gray-600 transition-colors relative">
              <FiShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white relative z-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `${mobileBaseLink} ${isActive ? mobileActiveLink : ""}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `${mobileBaseLink} ${isActive ? mobileActiveLink : ""}`
                }
              >
                Shop
              </NavLink>
              <NavLink
                to="/categories"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `${mobileBaseLink} ${isActive ? mobileActiveLink : ""}`
                }
              >
                Categories
              </NavLink>
              <NavLink
                to="/contact-us"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `${mobileBaseLink} ${isActive ? mobileActiveLink : ""}`
                }
              >
                Contact
              </NavLink>
            </div>
          </div>
        )}

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
            onClick={closeMobileMenu}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
