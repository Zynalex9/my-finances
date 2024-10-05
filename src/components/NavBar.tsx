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
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const [displayName, setDisplayName] = useState(""); // State for user display name
  const [isSignedIn, setIsSignedIn] = useState(false); // State for sign-in status
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

  return (
    <nav className="bg-dark-gray text-white w-full flex justify-between items-center p-4 shadow-md">
      <div className="flex items-center">
        <h2 className="text-xl font-bold">Logo</h2>
      </div>
      {isSignedIn ? (
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
      ) : (
        ""
      )}

      <div className="flex items-center border-l-2 border-slate-800 px-10">
        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="text-lg bg-slate-800 rounded-lg p-2">
              {displayName.toUpperCase()} {/* Display name in uppercase */}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={"#"}>Add Budget</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"#"}>Add Expense</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"#"}>Add Income</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/login"
            className="text-lg bg-slate-800 rounded-lg p-2 hover:bg-slate-700 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
