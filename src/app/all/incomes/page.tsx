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
import { Skeleton } from "@/components/ui/skeleton";

// Function to format the date into a more readable format
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const AllIncomes = () => {
  /* eslint-disable */const [incomes, setIncomes] = useState<any[]>([]);/* eslint-disable */
  const [loader, setLoader] = useState(true);

  // Fetch incomes from the API
  async function getIncomes() {
    try {
      setLoader(true);
      const response = await axios.get("/api/income/getincomes");
      if (response.status === 200) {
        setIncomes(response.data.incomes);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error fetching incomes:", error);
    }
  }

  useEffect(() => {
    getIncomes();
  }, []);

  // Display skeleton while loading
  if (loader) {
    return (
      <div className="bg-dark-gray text-white p-4" >
        <Table className="min-w-full bg-gray-800 rounded-lg shadow-md">
          <TableCaption>Loading incomes...</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left p-4">Source</TableHead>
              <TableHead className="text-left p-4">Currency</TableHead>
              <TableHead className="text-left p-4">Date</TableHead>
              <TableHead className="text-right p-4">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(6).fill(0).map((_, index) => (
              <TableRow key={index} className="p-4">
                <TableCell className="p-4">
                  <Skeleton className="h-4 w-20 bg-gray-700 rounded" />
                </TableCell>
                <TableCell className="p-4">
                  <Skeleton className="h-4 w-16 bg-gray-700 rounded" />
                </TableCell>
                <TableCell className="p-4">
                  <Skeleton className="h-4 w-24 bg-gray-700 rounded" />
                </TableCell>
                <TableCell className="p-4 text-right">
                  <Skeleton className="h-4 w-16 bg-gray-700 rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Render incomes once loaded
  return (
    <div className="bg-dark-gray text-white p-2">
      <Table className="min-w-full bg-gray-800 rounded-lg shadow-md">
        <TableCaption>A list of your incomes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left p-4">Source</TableHead>
            <TableHead className="text-left p-4">Currency</TableHead>
            <TableHead className="text-left p-4">Date</TableHead>
            <TableHead className="text-right p-4">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomes.length > 0 ? (
            incomes.map((income) => (
              <TableRow
                key={income._id}
                className="hover:bg-gray-700 hover:text-blue-600"
              >
                <TableCell className="p-4">{income.source.toUpperCase()}</TableCell>
                <TableCell className="p-4">{income.currency.toUpperCase()}</TableCell>
                <TableCell className="p-4">{formatDate(income.createdAt)}</TableCell>
                <TableCell className="p-4 text-right">
                  {(() => {
                    switch (income.currency) {
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
                  {income.amount.toFixed(2)}
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

export default AllIncomes;
