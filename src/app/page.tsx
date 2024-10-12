import BarCharts from "@/components/BarCharts";
import TotalIncome from "@/components/home/TotalIncome";
import LineCharts from "@/components/LineChart";
import PieCharts from "@/components/PieChart";
import AllIncomes from "./all/incomes/page";
export default function Home() {
  return (
    <>
      <main className="bg-dark-gray min-h-screen px-4">
        <div className="top-section flex flex-col md:flex-row gap-5 mb-8">
          <TotalIncome />
          <div className="div-2  min-h-44 w-full md:w-1/3">
            <BarCharts />
          </div>
          <div className="div-2  min-h-44  w-full md:w-1/3">
            <PieCharts />
          </div>
        </div>
        <h1 className="text-white text-3xl text-center ">Your Income(s)</h1>

        <div className="second w-full flex flex-col md:flex-row  justify-center gap-3">
          <div className="left w-full md:w-1/3  ">
            <LineCharts />
          </div>
          <div className="right w-full md:w-3/4">
            <AllIncomes />
          </div>
        </div>
      </main>
    </>
  );
}
