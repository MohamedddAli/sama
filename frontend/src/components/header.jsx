import { NavLink } from "react-router-dom";

const header = () => {
  const baseLink =
    "px-3 py-2 rounded-md font-medium text-gray-700 hover:text-sky-700 transition";
  const activeLink = "bg-sky-200 shadow text-sky-800 font-semibold";

  return (
    <header className="bg-sky-50 border-b border-gray-200 shadow-sm mb-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Placeholder */}
        <h1 className="text-2xl font-bold text-sky-700 tracking-wide">
          Sama International
        </h1>

        {/* Navigation */}
        <nav className="flex space-x-4">
          <NavLink
            to="/"
            end // 👈 ensures exact match for "/"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ""}`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ""}`
            }
          >
            Catalog
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ""}`
            }
          >
            Shop
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default header;
