"use client"; // Indicates that this component is client-rendered

import * as React from "react"; // Importing React
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

// Define a type for budget items
interface BudgetItem {
  category: string;
  amount: number;
}

// Function to generate HSL color for blue shades
const generateHSLColor = (index: number): string => {
  const hue = 210; // Hue for blue
  const saturation = 70; // Saturation for vibrancy
  const lightness = 40 + (index % 6) * 5; // Vary lightness for different shades
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const PieCharts = () => {
  const [chartData, setChartData] = useState<BudgetItem[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/budget/getallbudgets");
        const result: BudgetItem[] = response.data.budgets;

        // Update the formattedData to include colors dynamically
        const formattedData = result.map((budget, index) => ({
          category: budget.category,
          amount: budget.amount,
          fill: generateHSLColor(index), // Generate HSL color for each category
        }));

        setChartData(formattedData);
        console.log("formattedData,", formattedData);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    const totalBudgetAmount = async () => {
      try {
        const response = await axios.get("/api/budget/totalbudget");
        const totalIncome = response.data.totalIncome;
        setTotalIncome(totalIncome);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    fetchData();
    totalBudgetAmount();
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

  const totalVisitors = totalIncome;

  return (
    <Card className="flex flex-col bg-gray-800 text-white min-h-80">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Summary of Budgets</CardTitle>
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
                            {totalIncome.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Budget
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
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing a pie chart of your all budgets
        </div>
      </CardFooter>
    </Card>
  );
};

export default PieCharts; // Default export of the PieCharts component
