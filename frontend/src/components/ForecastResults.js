import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const ForecastResults = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (data && chartRef.current) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: data.forecast.map((day) => day.date),
          datasets: [
            {
              label: "Predicted Sales",
              data: data.forecast.map((day) => day.sales),
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 2,
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (!data) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-center text-gray-500">
          Select parameters and generate a forecast to see results.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Forecast Chart</h2>
        <div className="h-64">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold text-gray-800">
              {Math.round(data.summary.total)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Average Daily</p>
            <p className="text-2xl font-bold text-gray-800">
              {Math.round(data.summary.average)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Forecast</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Predicted Sales
                </th>
              </tr>
            </thead>
            <tbody>
              {data.forecast.map((day, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-2 px-4 border-b border-gray-200 text-sm">
                    {day.date}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-right">
                    {Math.round(day.sales)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ForecastResults;
