"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";

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
import { useEffect, useState } from "react";
import axios from "axios";

interface income {
  amount: number;
  createdAt: Date;
  currency: String;
  date: Date;
  source: String;
  updatedAt: Date;
  userId: string;
  __v: number;
  _id: String;
}
interface IncomesData {
  Income: String;
  amount: number;
  fill: String;
}
const LineCharts = () => {
  const description = "A radial chart with a label";
  const [chartData, setChartData] = useState<IncomesData[]>([]);
  function generateHSLColor(index: number) {
    const hue = 210; // Hue for blue
    const saturation = 70; // Saturation for vibrancy
    const lightness = 40 + (index % 6) * 7; // Vary lightness for different shades
    return ` hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await axios.get("/api/income/getincomes");
        const result = response.data.incomes;
        console.log("response.data", response.data.incomes);
        const formattedData = result.map((income: income, index: number) => ({
          Income: income.source,
          amount: income.amount,
          fill: generateHSLColor(index),
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };
    fetchIncomes();
  }, []);
  // const chartData = [
  //   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  //   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  //   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  //   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  //   { browser: "other", visitors: 90, fill: "var(--color-other)" },
  // ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col bg-gray-800 text-white">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={50}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="Income" />}
            />
            <RadialBar dataKey="amount" background>
              {/* Display the income source names on the bars */}
              <LabelList
                position="insideStart"
                dataKey="Income" // Use 'Income' key to show the source names
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default LineCharts;
