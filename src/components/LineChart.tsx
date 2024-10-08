"use client";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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
import { useState, useEffect } from "react";
import axios from "axios";

const LineCharts = () => {
  const [chartData, setChartData] = useState([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  useEffect(() => {
      const fetchIncomes = async () => {
          try {
              const response = await axios.get("/api/income/getincomes");
              const result = response.data;
  
              // Format the data for the chart
              const formattedData = result.incomes.map((income: any) => ({
                  month: new Date(income.date).toLocaleString("default", {
                      month: "long",
                  }),
                  amount: income.amount,
                  source: income.source,
              }));
  
              const totalIncome = formattedData.reduce((total:any, income:any) => total + income.amount, 0);
              setTotalIncome(totalIncome);
  
              // Assuming you need to display data per month for the chart
         
  
              setChartData(formattedData); // Update the chart data state
  
              console.log("Income result", result);
              console.log("Formatted Data", formattedData);
          } catch (error) {
              console.error("Error fetching budget data:", error);
          }
      };
  
      fetchIncomes();
  }, []);
  
  const description = "A multiple line chart";
  //   const chartData = [
  //     { month: "January", desktop: 186, mobile: 80 },
  //     { month: "February", desktop: 305, mobile: 200 },
  //     { month: "March", desktop: 237, mobile: 120 },
  //     { month: "April", desktop: 73, mobile: 190 },
  //     { month: "May", desktop: 209, mobile: 130 },
  //     { month: "June", desktop: 214, mobile: 140 },
  //   ];
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LineCharts;
