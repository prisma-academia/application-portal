import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
// import { TfiAlignJustify } from "react-icons/tfi";

const UserProfile = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    console.log("User logged out");
    // Handle logout logic
  };

  const handleSettings = () => {
    console.log("User settings");
    // Handle settings logic
  };

  return (
    <div className="relative">
      <div
        className="flex  items-center cursor-pointer p-2 rounded hover:bg-gray-100 transition  justify-end"
        onClick={handleToggleDropdown}
      >
        {user.image ? (
          <img
            src={user.image}
            alt="User"
            className="w-10 h-10 rounded-full mr-2"
          />
        ) : (
          <FaUserCircle className="w-10 h-10 text-gray-400 mr-2" />
        )}
        <span className="font-semibold text-gray-700">{user.name}</span>
        {/* <FaChevronDown className="text-gray-400 absolute right-1" /> */}
        {/* <TfiAlignJustify className="text-black absolute right-5" /> */}
      </div>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
          {/* <FaUserCircle className="w-10 h-10 text-gray-400 mr-2" /> */}
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={handleSettings}
          >
            Settings
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
