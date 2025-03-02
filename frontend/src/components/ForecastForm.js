import React, { useState } from "react";

const ForecastForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    country: "Norway",
    store: "Premium Sticker Mart",
    product: "Kaggle",
    start_date: new Date().toISOString().split("T")[0],
    days: 30,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "days" ? parseInt(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Forecast Parameters</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="country"
          >
            Country
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="Canada">Canada</option>
            <option value="Finland">Finland</option>
            <option value="Italy">Italy</option>
            <option value="Kenya">Kenya</option>
            <option value="Norway">Norway</option>
            <option value="Singapore">Singapore</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="store"
          >
            Store
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="store"
            name="store"
            value={formData.store}
            onChange={handleChange}
          >
            <option value="Discount Stickers">Discount Stickers</option>
            <option value="Premium Sticker Mart">Premium Sticker Mart</option>
            <option value="Stickers for Less">Stickers for Less</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="product"
          >
            Product
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="product"
            name="product"
            value={formData.product}
            onChange={handleChange}
          >
            <option value="Holographic Goose">Holographic Goose</option>
            <option value="Kaggle">Kaggle</option>
            <option value="Kaggle Tiers">Kaggle Tiers</option>
            <option value="Kerneler">Kerneler</option>
            <option value="Kerneler Dark Mode">Kerneler Dark Mode</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="start_date"
          >
            Start Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="days"
          >
            Forecast Days
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="days"
            name="days"
            type="number"
            min="1"
            max="365"
            value={formData.days}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Generate Forecast
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForecastForm;
