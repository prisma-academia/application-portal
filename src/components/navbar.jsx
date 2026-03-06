import React, { useState } from "react";
import defaultLogo from "../assets/nurselogo.jpeg";
import config from "../config";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logOut = useAuthStore((state) => state.logOut);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img className="h-12 w-auto rounded-md" src={config.logoUrl || defaultLogo} alt="" />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/" className="text-slate-700 hover:bg-primary/10 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Home</Link>
                <Link to="/admission" className="text-slate-700 hover:bg-primary/10 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Check Admission</Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button
              onClick={logOut}
              className="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center shadow-sm transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-slate-700 hover:bg-primary/10 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">Home</Link>
            <Link to="/admission" className="text-slate-700 hover:bg-primary/10 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">Check Admission</Link>
            <button
              onClick={logOut}
              className="w-full text-left text-slate-700 hover:bg-primary/10 hover:text-primary block px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;