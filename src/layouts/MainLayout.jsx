import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, X, ParkingCircle } from "lucide-react";

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-br from-emerald-100 to-yellow-100  shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600 text-white rounded-xl flex items-center justify-center">
              {/* Replace this with your actual logo image if available */}
              <ParkingCircle className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-gray-800 text-lg">SmartPark</span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
                      <Link
            to="/signup"
            className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-emerald-400  to-yellow-600 rounded-lg shadow-md hover:from-emerald-600 hover:to-yellow-700 transition-all duration-200 active:scale-95"
          >
            Get Started
          </Link>

            </li>
            <li>
              <Link
                to="/login"
                className="text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Sign In
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-700 focus:outline-none"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
            <ul className="flex flex-col items-start px-6 py-4 space-y-4 text-sm font-medium">
              <li>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 hover:text-emerald-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 hover:text-emerald-600"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 hover:text-emerald-600"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600 rounded-xl flex items-center justify-center">
                <ParkingCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-white">SmartParking</div>
                <div className="text-xs">Park Smartly</div>
              </div>
            </div>

            <div className="text-sm text-center md:text-left">
              <p>© {new Date().getFullYear()} SmartParking. Solving parking one spot at a time.</p>
              <p className="mt-1">
                 Built for Everyone • Trusted by thousands
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
