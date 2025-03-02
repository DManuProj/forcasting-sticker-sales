import React, { useState, useEffect } from "react";
import ForecastForm from "./components/ForecastForm";
import ForecastResults from "./components/ForecastResults";
import "./App.css";

function App() {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateForecast = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setForecastData(data);
    } catch (error) {
      setError("Failed to generate forecast. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Sticker Sales Forecasting
          </h1>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <ForecastForm onSubmit={generateForecast} />
            </div>

            <div className="md:w-2/3">
              {loading ? (
                <div className="bg-white shadow rounded-lg p-6">
                  <p className="text-center text-gray-500">
                    Generating forecast...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-white shadow rounded-lg p-6">
                  <p className="text-center text-red-500">{error}</p>
                </div>
              ) : (
                <ForecastResults data={forecastData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
