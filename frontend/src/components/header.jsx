// components/Header.jsx
import { Link } from "react-router-dom";

const header = () => {
  return (
    <header className="bg-sky-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Placeholder */}
        <h1 className="text-2xl font-bold text-sky-700 tracking-wide">
          BrandName
        </h1>

        {/* Navigation */}
        <nav className="space-x-6">
          <Link
            to="/products"
            className="text-gray-700 hover:text-sky-600 font-medium transition"
          >
            Products
          </Link>
          <Link
            to="/catalog"
            className="text-gray-700 hover:text-sky-600 font-medium transition"
          >
            Catalog
          </Link>
          <Link
            to="/shop"
            className="text-gray-700 hover:text-sky-600 font-medium transition"
          >
            Shop
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default header;
