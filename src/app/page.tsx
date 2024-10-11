import BarCharts from "@/components/BarCharts";
import TotalIncome from "@/components/home/TotalIncome";
import LineCharts from "@/components/LineChart";
import PieCharts from "@/components/PieChart";

export default function Home() {
  return (
    <>
      {/* <BarCharts />
      <PieCharts />
      <LineCharts /> */}
      <main className="bg-dark-gray min-h-screen px-4">
        <div className="top-section flex gap-5">
          <TotalIncome />
          <div className="div-2  min-h-44 w-1/3">
            <BarCharts />
          </div>
          <div className="div-2  min-h-44 w-1/3">
            <PieCharts />
          </div>
        </div>
      </main>
    </>
  );
}
