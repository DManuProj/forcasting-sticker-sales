# save_models.py
import os
import pickle
import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.metrics import mean_absolute_percentage_error

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Load training data
print("Loading training data...")
train = pd.read_csv('../data/train.csv')
print(f"Loaded training data with shape: {train.shape}")

# Convert date column to datetime format
train['date'] = pd.to_datetime(train['date'])

# Fill missing values
print("Handling missing values...")
train_filled = train.copy()
train_filled['num_sold'] = train.groupby(['country', 'product'])['num_sold'].transform(
    lambda x: x.fillna(x.median())
)
train_filled['num_sold'] = train_filled.groupby(['country'])['num_sold'].transform(
    lambda x: x.fillna(x.median())
)
global_median = train['num_sold'].median()
train_filled['num_sold'] = train_filled['num_sold'].fillna(global_median)

# Create features
print("Creating features...")
def create_features(df):
    df = df.copy()
    
    # Time features
    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month
    df['day_of_week'] = df['date'].dt.dayofweek
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    
    # Categorical features
    df['country_code'] = df['country'].astype('category').cat.codes
    df['store_code'] = df['store'].astype('category').cat.codes
    df['product_code'] = df['product'].astype('category').cat.codes
    
    # Time trend
    df['days_from_start'] = (df['date'] - pd.to_datetime('2010-01-01')).dt.days
    
    # Quarter
    df['quarter'] = df['date'].dt.quarter
    
    return df

train_features = create_features(train_filled)

# Split into training and validation
print("Splitting data...")
train_model = train_features[train_features['year'] < 2016].copy()
val = train_features[train_features['year'] == 2016].copy()
print(f"Training set: {train_model.shape}, Validation set: {val.shape}")

# Define feature columns
feature_cols = [
    'year', 'month', 'day_of_week', 'is_weekend',
    'country_code', 'store_code', 'product_code',
    'days_from_start', 'quarter'
]

# LightGBM parameters
lgb_params = {
    'objective': 'regression',
    'metric': 'mape',
    'boosting_type': 'gbdt',
    'num_leaves': 31,
    'learning_rate': 0.05,
    'feature_fraction': 0.9,
    'bagging_fraction': 0.8,
    'bagging_freq': 5,
    'verbose': -1
}

# Train a model for each country
countries = train['country'].unique()
print(f"Training models for {len(countries)} countries: {countries}")

for country in countries:
    print(f"Training model for {country}...")
    
    # Filter data for this country
    country_mask_train = train_model['country'] == country
    country_mask_val = val['country'] == country
    
    X_train_country = train_model.loc[country_mask_train, feature_cols]
    y_train_country = train_model.loc[country_mask_train, 'num_sold']
    X_val_country = val.loc[country_mask_val, feature_cols]
    y_val_country = val.loc[country_mask_val, 'num_sold']
    
    # Train model
    model = lgb.LGBMRegressor(**lgb_params)
    model.fit(X_train_country, y_train_country)
    
    # Evaluate on validation
    if not X_val_country.empty and not y_val_country.empty:
        val_pred = model.predict(X_val_country)
        val_mape = mean_absolute_percentage_error(y_val_country, val_pred) * 100
        print(f"  Validation MAPE for {country}: {val_mape:.4f}%")
    
    # Save model
    model_path = os.path.join('models', f'{country.lower()}_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    print(f"  Saved model to {model_path}")

print("All models trained and saved successfully!")