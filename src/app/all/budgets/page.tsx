"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Function to format the date into MM/DD/YYYY
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit", // Ensures two-digit month
    day: "2-digit", // Ensures two-digit day
  };
  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(
    new Date(dateString)
  );
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const year = parts.find((part) => part.type === "year")?.value;
  return `${month}/${day}/${year}`; // Returns in MM/DD/YYYY format
};

const Page = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loader, setLoader] = useState(true);

  async function getBudgets() {
    try {
      setLoader(true);
      const response = await axios.get("/api/budget/getallbudgets");
      if (response.status === 200) {
        setBudgets(response.data.budgets);
        console.log(response.data.budgets); // Log the budgets here
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error fetching budgets:", error);
    }
  }

  useEffect(() => {
    getBudgets();
  }, []);

  return (
    <div className="bg-dark-gray text-white min-h-screen p-2">
      <Table className="min-w-full bg-gray-800 rounded-lg shadow-md">
        <TableCaption>A list of your budgets.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left p-4">Category</TableHead>
            <TableHead className="text-left p-4">Currency</TableHead>
            <TableHead className="text-left p-4">Start Date</TableHead>
            <TableHead className="text-left p-4">End Date</TableHead>
            <TableHead className="text-right p-4">Amount</TableHead>
            <TableHead className="text-right p-4">Remaining Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets.length > 0 ? (
            budgets.map((budget) => (
              <TableRow
                key={budget.id}
                className="hover:bg-gray-700 hover:text-blue-600"
              >
                <TableCell className="p-4">
                  {budget.category.toUpperCase()}
                </TableCell>
                <TableCell className="p-4">
                  {budget.currency.toUpperCase()}
                </TableCell>
                <TableCell className="p-4">
                  {formatDate(budget.startDate)}
                </TableCell>
                <TableCell className="p-4">
                  {formatDate(budget.endDate)}
                </TableCell>
                <TableCell className="p-4 text-right">
                  {(() => {
                    switch (budget.currency) {
                      case "usd":
                        return "$";
                      case "eur":
                        return "€";
                      case "pkr":
                        return "RS";
                      case "inr":
                        return "₹";
                      default:
                        return "";
                    }
                  })()}{" "}
                  {budget.amount.toFixed(2)}
                </TableCell>
                <TableCell className="p-4 text-right">
                  {(() => {
                    switch (budget.currency) {
                      case "usd":
                        return "$";
                      case "eur":
                        return "€";
                      case "pkr":
                        return "RS";
                      case "inr":
                        return "₹";
                      default:
                        return "";
                    }
                  })()}{" "}
                  {budget.remainingAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center p-4">
                No budgets available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
