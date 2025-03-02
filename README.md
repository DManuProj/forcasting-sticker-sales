# Sticker Sales Forecasting Application

This project is a full-stack application for forecasting sticker sales based on historical data from a Kaggle competition. It combines a Flask backend with machine learning models and a React frontend to provide a user-friendly interface for sales predictions.

## Project Structure

```
sticker-sales-forecaster/
├── backend/
│   ├── app.py                  # Flask API server
│   ├── save_models.py          # Script to train and save models
│   └── models/                 # Directory for saved models
│
├── data/
│   ├── train.csv               # Training data from Kaggle competition
│   └── test.csv                # Test data from Kaggle competition
│
└── frontend/                   # React application
    ├── public/
    ├── src/
    │   ├── App.js
    │   ├── components/
    │   │   ├── ForecastForm.js
    │   │   └── ForecastResults.js
    │   └── ...
    └── ...
```

## Getting Started

### Backend Setup

1. **Navigate to the backend directory**:
   ```sh
   cd backend
   ```

2. **Create a virtual environment** (optional but recommended):
   ```sh
   # For Windows
   python -m venv venv
   venv\Scripts\activate

   # For macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install required packages**:
   ```sh
   pip install flask flask-cors pandas numpy scikit-learn lightgbm
   ```

4. **Train the machine learning models**:
   ```sh
   python save_models.py
   ```
   This will:
   - Load the training data from the data directory
   - Process and clean the data
   - Train LightGBM models for each country
   - Save the models to the models directory

5. **Start the Flask server**:
   ```sh
   python app.py
   ```
   The backend will be available at [http://localhost:5000](http://localhost:5000)

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```sh
   cd frontend
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Start the development server**:
   ```sh
   npm start
   ```
   The frontend will be available at [http://localhost:3000](http://localhost:3000)

## Using the Application

1. Select the country, store, and product for which you want to forecast sales
2. Choose a start date and the number of days to forecast
3. Click "Generate Forecast" to see the results
4. View the forecast chart and detailed daily predictions

## Features

- Country-specific machine learning models for more accurate forecasts
- Interactive chart visualization of predicted sales
- Detailed day-by-day forecast table
- Summary statistics including total and average predicted sales

## Technical Details

### Backend (Python/Flask)

- **Machine Learning**: Uses LightGBM for gradient boosting regression models
- **Data Processing**: Handles missing values, creates time-based features
- **API**: Provides a RESTful endpoint for forecasting

### Frontend (React)

- **UI Components**: Form inputs for forecast parameters
- **Data Visualization**: Chart.js for graphical representation
- **Responsive Design**: Adapts to different screen sizes

## Development Notes

- The models are trained on historical data from specific countries only (Canada, Finland, Italy, Kenya, Norway, Singapore)
- Time-based features (year, month, day of week, etc.) are used to capture seasonal patterns
- Each country has its own trained model to better capture market-specific patterns

## Troubleshooting

- **Models not found**: Ensure you've run `save_models.py` before starting the Flask server
- **Data file errors**: Make sure `train.csv` and `test.csv` are in the correct location
- **Connection issues**: Verify both backend and frontend servers are running
- **Package errors**: Ensure all required packages are installed


