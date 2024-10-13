"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TotalIncome = () => {
  const [income, setIncome] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/income/totalIncome");
        setIncome(response.data.totalIncome);
      } catch (error) {
        console.error("Error fetching total income:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  const formatIncome = (value: number | undefined) => {
    if (value !== undefined) {
      return `$${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return "Income not available";
  };

  return (
    <div className="w-full mr-5 md:mx-0 md:w-1/3 text-white border bg-gray-800 py-8 px-12 flex flex-col justify-around gap-8 m-1 rounded-lg md:h-80 hover:shadow-2xl transition-shadow">
      <div className="section-header">
        <h1 className="text-3xl">Balance</h1>
      </div>

      {loading ? (
        <Skeleton className="w-24 h-10 bg-gray-700 rounded"></Skeleton> // Adjusted skeleton width/height for a more realistic look
      ) : (
        <div className="balance text-3xl font-semibold">
          {formatIncome(income)}
        </div>
      )}

      <div className="footer">
        <p>
          You total income is <strong>{income ? formatIncome(income) : "calculating..."}</strong>.
        </p>
        <p>
          Keep track of your <strong>financial goals</strong> and plan wisely!
        </p>
      </div>
    </div>
  );
};

export default TotalIncome;
