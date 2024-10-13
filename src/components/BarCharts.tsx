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
        const formattedData = result.budgets.map((budget: any) => ({
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
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
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
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
    </Card>
  );
};

export default BarCharts;
