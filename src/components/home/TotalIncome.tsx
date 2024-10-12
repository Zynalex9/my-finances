"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const TotalIncome = () => {
  const [income, setIncome] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
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

  useEffect(() => {
    console.log("Income updated:", income);
  }, [income]);

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
    <div className="w-full mr-5 md:mx-0 md:w-1/3 text-white border bg-gray-800 py-8 px-12 flex flex-col justify-around gap-8 m-1 rounded-lg md:h-80 hover:shadow-2xl transition-shadow	 ">
      <div className="section-header">
        <h1 className="text-3xl">Balance</h1>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="balance text-3xl font-semibold">
          {formatIncome(income)}
        </div>
      )}
      <div className="footer">
        <p>
          Available to spend: <strong>$20912.2</strong>{" "}
        </p>
        <p>
          Total Budgets: <strong>$20912.2</strong>{" "}
        </p>
      </div>
    </div>
  );
};

export default TotalIncome;
