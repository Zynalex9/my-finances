"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NavBar = () => {
  const [displayName, setDisplayName] = useState(""); // State for user display name
  const [isSignedIn, setIsSignedIn] = useState(false); // State for sign-in status

  async function fetchUser() {
    try {
      const response = await axios.get("/api/user/getuser");
      if (response.data.user) {
        setDisplayName(response.data.user.displayName); // Set display name if user exists
        setIsSignedIn(true); // User is signed in
      } else {
        setDisplayName(""); // Reset display name if user is not found
        setIsSignedIn(false); // User is not signed in
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setIsSignedIn(false); // Handle error by setting user as not signed in
    }
  }

  useEffect(() => {
    fetchUser(); // Fetch user data on component mount
  }, []);

  return (
    <nav className="bg-dark-gray text-white w-full flex justify-between items-center p-4 shadow-md">
      <div className="flex items-center">
        <h2 className="text-xl font-bold">Logo</h2>
      </div>
      <div className="flex space-x-6">
        <Link
          href="#"
          className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md"
        >
          Dashboard
        </Link>
        <Link
          href="#"
          className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md"
        >
          Expenses
        </Link>
        <Link
          href="#"
          className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md"
        >
          All Incomes
        </Link>
        <Link
          href="#"
          className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md"
        >
          All Budgets
        </Link>
      </div>
      <div className="flex items-center border-l-2 border-slate-800 pl-4">
        <h1 className="text-lg bg-gray-700 text-center rounded-lg p-2">
          {isSignedIn ? displayName.toUpperCase() : "WELCOME, GUEST!"}
        </h1>
      </div>
    </nav>
  );
};

export default NavBar;
