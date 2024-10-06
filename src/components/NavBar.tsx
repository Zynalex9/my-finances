"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const [displayName, setDisplayName] = useState(""); // State for user display name
  const [isSignedIn, setIsSignedIn] = useState(false); // State for sign-in status
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await axios.post("/api/user/sign-out");
      setIsSignedIn(false); // Update sign-in status
      setDisplayName(""); // Reset display name
      router.replace("/sign-in"); // Redirect to sign-in page
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

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

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  return (
    <nav className="bg-dark-gray text-white w-full flex justify-between items-center p-4 shadow-md relative">
      <div className="flex items-center space-x-20">
        <h2 className="text-xl font-bold">Logo</h2>
        {/* Menu Button for Small Screens */}
        <div className="block lg:hidden ">
          <button onClick={toggleDropdown} className="text-white">
            <span className="text-xl "><h1>Menu</h1></span>
          </button>
        </div>
      </div>

      {/* Links for Large Screens */}
      <div className="hidden lg:flex space-x-6">
        {isSignedIn && (
          <>
            <Link href="/" className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md">Dashboard</Link>
            <Link href="/all/expenses" className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md">Expenses</Link>
            <Link href="/all/incomes" className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md">All Incomes</Link>
            <Link href="/all/budgets" className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md">All Budgets</Link>
          </>
        )}
      </div>

      <div className="flex items-center border-l-2 border-slate-800">
        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="text-lg bg-slate-800 rounded-lg p-2">
              {displayName.toUpperCase()} {/* Display name in uppercase */}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={"/add/add-new-budget"}>Add Budget</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/add/add-new-expense"}>Add Expense</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/add/add-new-income"}>Add Income</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/sign-in"
            className="text-lg bg-slate-800 rounded-lg p-2 hover:bg-slate-700 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Dropdown Menu for Small Screens */}
      {isDropdownOpen && (
        <div className="absolute top-16 left-0 w-full bg-dark-gray z-50">
          <div className="flex flex-col space-y-2 p-4">
            {isSignedIn && (
              <>
                <Link href={"/"} className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md">Dashboard</Link>
                <Link href="/all/budgets" className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md">Expenses</Link>
                <Link href="/all/incomes" className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md">All Incomes</Link>
                <Link href="/all/expenses" className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md">All Budgets</Link>
              </>
            )}
            {!isSignedIn && (
              <Link
                href="/sign-in"
                className="text-lg bg-slate-800 rounded-lg p-2 hover:bg-slate-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
