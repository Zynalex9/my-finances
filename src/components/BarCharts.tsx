"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "./ui/skeleton";

// Chart configuration
const chartConfig = {
  amount: {
    label: "Budget Amount",
    color: "#2563EB",
  },
  remainingAmount: {
    label: "Remaining Amount",
    color: "#5EA4F5",
  },
} satisfies ChartConfig;
interface Budget{
  amount:number,
  category:string,
  remainingAmount:number
}
const BarCharts = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  // Fetch the budget data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/budget/getallbudgets"); // Replace with your API endpoint
        const result = response.data;
        console.log("response.data", response.data);
        const formattedData = result.budgets.map((budget: Budget) => ({
          month: budget.category.toUpperCase(),
          amount: budget.amount,
          remainingAmount: budget.remainingAmount,
        }));
        setLoading(false);
        setChartData(formattedData);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching budget data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) {
    return (
      <Card className="bg-gray-800 text-white min-h-80">
        <CardHeader>
          <CardTitle>Bar Chart - Budget Overview</CardTitle>
          <CardDescription>
            Budget comparison by amount and remaining amount
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-52 bg-gray-700 rounded-md" />
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
      </Card>
    );
  }
  return (
    <Card className="bg-gray-800 text-white min-h-80">
      <CardHeader>
        <CardTitle>Bar Chart - Budget Overview</CardTitle>
        <CardDescription>
          Budget comparison by amount and remaining amount
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
              <Bar
                dataKey="remainingAmount"
                fill="var(--color-remainingAmount)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="text-4xl text-center mt-12 bg-blue-800 rounded-lg text-slate-200">
            No Budgets Yet
          </div>
        )}
      </CardContent>
      {chartData.length > 0 ? (
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            <TrendingUp className="h-4 w-4" /> Visual Representation of your
            Budgets
          </div>
        </CardFooter>
      ) : (
        <div className="flex items-center gap-2 font-medium leading-none"></div>
      )}
    </Card>
  );
};

export default BarCharts;
