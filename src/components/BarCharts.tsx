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

// Chart configuration
const chartConfig = {
  amount: {
    label: "Budget Amount",
    color: "hsl(var(--chart-1))",
  },
  remainingAmount: {
    label: "Remaining Amount",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const BarCharts = () => {
  const [chartData, setChartData] = useState([]);

  // Fetch the budget data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/budget/getallbudgets"); // Replace with your API endpoint
        const result = response.data;
        // Format the data for the chart
        const formattedData = result.budgets.map((budget: any) => ({
          month: new Date(budget.startDate).toLocaleString("default", {
            month: "long",
          }),
          amount: budget.amount,
          remainingAmount: budget.remainingAmount,
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    fetchData();
  }, []);

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
              tickFormatter={(value) => value.slice(0, 3)} // Shorten month name
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
      <CardFooter className="flex-col items-start gap-2 text-sm">
      </CardFooter>
    </Card>
  );
};

export default BarCharts;
