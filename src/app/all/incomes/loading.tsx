import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  // Simulate an array of placeholder elements for the loading state
  const incomes = Array(6).fill(null);

  return (
    <div className="bg-dark-gray text-white min-h-screen p-4">
      {/* Card skeleton */}
      <Skeleton className="min-w-full bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-48 bg-gray-700 rounded" />

        {/* Table headers skeleton */}
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24 bg-gray-700 rounded" />
          <Skeleton className="h-4 w-24 bg-gray-700 rounded" />
          <Skeleton className="h-4 w-24 bg-gray-700 rounded" />
          <Skeleton className="h-4 w-24 bg-gray-700 rounded" />
        </div>

        {/* Simulate rows of income data */}
        <div className="space-y-4">
          {incomes.map((_, index) => (
            <div
              key={index}
              className="flex justify-between items-center hover:bg-gray-700 p-4 rounded-md"
            >
              <Skeleton className="h-4 w-20 bg-gray-700 rounded" />
              <Skeleton className="h-4 w-20 bg-gray-700 rounded" />
              <Skeleton className="h-4 w-20 bg-gray-700 rounded" />
              <Skeleton className="h-4 w-20 bg-gray-700 rounded text-right" />
            </div>
          ))}
        </div>
      </Skeleton>
    </div>
  );
};

export default Loading;
