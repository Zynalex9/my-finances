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
const Page = () => {
  const [expenses, setExpenses] = useState<any[]>([]);

  async function getExpenses() {
    try {
      const response = await axios.get("/api/expense/getexpenses");
      if (response.status === 200) {
        setExpenses(response.data.allExpenses); // Changed from incomes to allExpenses
        console.log(response.data.allExpenses); // Log the correct data
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  useEffect(() => {
    getExpenses();
  }, []);

  return (
    <div className="bg-dark-gray py-4">
    <Table className="min-w-full bg-gray-800 rounded-lg shadow-md text-white">
      <TableCaption className="text-white">A list of your incomes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left p-4 ">Expense</TableHead>
          <TableHead className="text-left p-4">Currency</TableHead>
          <TableHead className="text-left p-4">Date</TableHead>
          <TableHead className="text-right p-4">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <TableRow
              key={expense._id}
              className="hover:bg-gray-700 hover:text-blue-600"
            >
              <TableCell className="p-4">
                {expense.category.toUpperCase()}
              </TableCell>
              <TableCell className="p-4">
                {expense.currency.toUpperCase()}
              </TableCell>
              <TableCell className="p-4">
                {formatDate(expense.spendingDate)}
              </TableCell>
              <TableCell className="p-4 text-right">
                {(() => {
                  switch (expense.currency) {
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
                })()}
                {expense.amount.toFixed(2)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center p-4">
              No incomes available.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    </div>
  );
};

export default Page;
