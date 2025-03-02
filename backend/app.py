# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import pickle
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Dictionary to store models for each country
models = {}

def load_models():
    """Load all trained country-specific models from pickle files"""
    # Check if models directory exists
    if not os.path.exists('models'):
        os.makedirs('models', exist_ok=True)
        print("Models directory not found. Please run save_models.py first.")
        return False
    
    # Get list of countries from model files
    model_files = [f for f in os.listdir('models') if f.endswith('_model.pkl')]
    if not model_files:
        print("No model files found in the models directory. Please run save_models.py first.")
        return False
    
    # Load each model
    for model_file in model_files:
        country = model_file.split('_model.pkl')[0].capitalize()
        model_path = os.path.join('models', model_file)
        try:
            with open(model_path, 'rb') as f:
                models[country] = pickle.load(f)
            print(f"Loaded model for {country}")
        except Exception as e:
            print(f"Error loading model for {country}: {str(e)}")
    
    return True

def create_features(date, country, store, product):
    """Create features for a single date-country-store-product combination"""
    # Convert date string to datetime
    if isinstance(date, str):
        date = pd.to_datetime(date)
    
    # Create dictionary with features
    features = {
        'year': date.year,
        'month': date.month,
        'day_of_week': date.dayofweek,
        'is_weekend': 1 if date.dayofweek in [5, 6] else 0,
        'quarter': date.quarter,
        'days_from_start': (date - pd.to_datetime('2010-01-01')).days
    }
    
    # Store and product encoding
    store_mapping = {
        'Discount Stickers': 0,
        'Premium Sticker Mart': 1,
        'Stickers for Less': 2
    }
    
    product_mapping = {
        'Holographic Goose': 0,
        'Kaggle': 1,
        'Kaggle Tiers': 2,
        'Kerneler': 3,
        'Kerneler Dark Mode': 4
    }
    
    country_mapping = {
        'Canada': 0,
        'Finland': 1,
        'Italy': 2,
        'Kenya': 3,
        'Norway': 4,
        'Singapore': 5
    }
    
    features['country_code'] = country_mapping.get(country, 0)
    features['store_code'] = store_mapping.get(store, 0)
    features['product_code'] = product_mapping.get(product, 0)
    
    return features

@app.route('/api/forecast', methods=['POST'])
def forecast():
    try:
        # Get request data
        data = request.json
        country = data.get('country')
        store = data.get('store')
        product = data.get('product')
        start_date = data.get('start_date')
        days = int(data.get('days', 30))
        
        # Validate required fields
        if not all([country, store, product, start_date]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        # Get the model for this country
        model = models.get(country)
        if not model:
            return jsonify({"error": f"No model available for {country}"}), 400
        
        # Generate dates for forecast period
        start_date = pd.to_datetime(start_date)
        dates = [start_date + timedelta(days=i) for i in range(days)]
        
        # Create features for each date
        feature_rows = []
        for date in dates:
            features = create_features(date, country, store, product)
            feature_rows.append(features)
        
        # Convert to DataFrame
        feature_df = pd.DataFrame(feature_rows)
        
        # Define the feature columns in the same order as in the training
        feature_cols = [
            'year', 'month', 'day_of_week', 'is_weekend',
            'country_code', 'store_code', 'product_code',
            'days_from_start', 'quarter'
        ]
        
        # Make prediction
        predictions = model.predict(feature_df[feature_cols])
        
        # Ensure predictions are non-negative
        predictions = np.maximum(predictions, 0)
        
        # Create response
        forecast_data = []
        for i, date in enumerate(dates):
            forecast_data.append({
                "date": date.strftime('%Y-%m-%d'),
                "sales": float(predictions[i])
            })
        
        # Calculate summary statistics
        total_sales = np.sum(predictions)
        avg_sales = np.mean(predictions)
        
        response = {
            "forecast": forecast_data,
            "summary": {
                "total": float(total_sales),
                "average": float(avg_sales)
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "running",
        "models_loaded": list(models.keys())
    })

if __name__ == '__main__':
    print("Starting Sticker Sales Forecasting API...")
    load_models()
    print("Starting Flask server on http://localhost:5000")
    app.run(debug=True)