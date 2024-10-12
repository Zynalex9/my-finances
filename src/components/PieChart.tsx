"use client"; // Indicates that this component is client-rendered

import * as React from "react";
import axios from "axios";
import { TrendingUp } from "lucide-react"; // Importing an icon for the footer
import { Label, Pie, PieChart } from "recharts"; // Importing necessary components from Recharts
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Importing UI components
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"; // Importing chart-related UI components
import { useState, useEffect } from "react";

// Define a type for expense items
interface ExpenseItem {
  category: string;
  amount: number;
  currency: string;
}

// Function to generate HSL color for blue shades
const generateHSLColor = (index: number): string => {
  const hue = 210; // Hue for blue
  const saturation = 70; // Saturation for vibrancy
  const lightness = 40 + (index % 6) * 5; // Vary lightness for different shades
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const PieCharts = () => {
  const [chartData, setChartData] = useState<ExpenseItem[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/expense/getexpenses");
        const result = response.data.allExpenses;
        console.log("response.data.allExpenses", result);

        // Format the data for the pie chart
        const formattedData = result.map((expense: any, index: any) => ({
          category: expense.category,
          amount: expense.amount,
          currency: expense.currency,
          fill: generateHSLColor(index), // Generate HSL color for each category
        }));

        setChartData(formattedData);

        // Calculate total expenses
        const total = result.reduce(
          (sum: any, expense: any) => sum + expense.amount,
          0
        );
        setTotalExpenses(total);

        console.log("formattedData Pie Chart,", formattedData);
      } catch (error) {
        console.error("Error fetching expense data:", error);
      }
    };

    fetchData();
  }, []);

  const description = "A donut chart with text";

  const chartConfig = {
    visitors: { label: "Visitors" },
    chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
    safari: { label: "Safari", color: "hsl(var(--chart-2))" },
    firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
    edge: { label: "Edge", color: "hsl(var(--chart-4))" },
    other: { label: "Other", color: "hsl(var(--chart-5))" },
  } satisfies ChartConfig;

  const totalVisitors = totalExpenses;

  return (
    <Card className="flex flex-col bg-gray-800 text-white min-h-80">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Summary of Expenses</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] "
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              animationDuration={500}
            >
              {chartData.map((entry, index) => (
                <Label
                  key={`cell-${index}`}
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-white"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalExpenses.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Expenses
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" /> Visual Representation of your
          expenses
        </div>
      </CardFooter>
    </Card>
  );
};

export default PieCharts;
