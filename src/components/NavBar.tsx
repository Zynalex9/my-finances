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
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const [displayName, setDisplayName] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await axios.post("/api/user/sign-out");
      setIsSignedIn(false);
      setDisplayName("");
      router.replace("/sign-in");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  async function fetchUser() {
    try {
      setLoading(true);
      const response = await axios.get("/api/user/getuser");
      if (response.data.user) {
        setDisplayName(response.data.user.displayName);
        setIsSignedIn(true);
        setLoading(false);
      } else {
        setDisplayName("");
        setIsSignedIn(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch user:", error);
      setIsSignedIn(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  if (loading) {
    return (
      <nav className="bg-dark-gray text-white w-full flex justify-between items-center p-4 shadow-md relative">
        <div className="flex items-center space-x-20">
          <Skeleton className="w-32 h-8" /></div>
        <div className="hidden lg:flex space-x-6">
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-24 h-6" />
        </div>
        <div className="flex items-center border-l-2 border-slate-800">
          <Skeleton className="w-20 h-8" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-dark-gray text-white w-full flex justify-between items-center p-4 shadow-md relative">
      <div className="flex items-center justify-between w-full lg:w-auto space-x-4">
        {/* MyFinance Logo */}
        <h2 className="text-xl font-bold bg-slate-800 p-2 rounded-lg">
          <Link href="/">MyFinance</Link>
        </h2>

        {/* Menu button for small screens */}
        <div className="block lg:hidden">
          <button onClick={toggleDropdown} className="text-white">
            <span className="text-xl">
              <h1>Menu</h1>
            </span>
          </button>
        </div>
      </div>

      {/* Links - only visible on large screens */}
      <div className="hidden lg:flex space-x-6">
        {isSignedIn && (
          <>
            <Link
              href="/"
              className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md"
            >
              Dashboard
            </Link>
            <Link
              href="/all/expenses"
              className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md"
            >
              Expenses
            </Link>
            <Link
              href="/all/incomes"
              className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md"
            >
              All Incomes
            </Link>
            <Link
              href="/all/budgets"
              className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md"
            >
              All Budgets
            </Link>
          </>
        )}
      </div>

      {/* Sign In / Account Options */}
      <div className="flex items-center border-l-4 border-slate-800 pl-2 space-x-2">
        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="text-lg bg-slate-800 rounded-lg p-2">
              {displayName.toUpperCase()}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/add/add-new-budget">Add Budget</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/add/add-new-expense">Add Expense</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/add/add-new-income">Add Income</Link>
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

      {/* Dropdown menu for small screens */}
      {isDropdownOpen && (
        <div className="absolute top-16 left-0 w-full bg-dark-gray z-50">
          <div className="flex flex-col space-y-2 p-4">
            {isSignedIn && (
              <>
                <Link
                  href="/"
                  className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md"
                >
                  Dashboard
                </Link>
                <Link
                  href="/all/expenses"
                  className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md"
                >
                  All Expenses
                </Link>
                <Link
                  href="/all/incomes"
                  className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md"
                >
                  All Incomes
                </Link>
                <Link
                  href="/all/budgets"
                  className="hover:text-white transition-colors p-4 hover:bg-slate-800 rounded-md"
                >
                  All Budgets
                </Link>
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
