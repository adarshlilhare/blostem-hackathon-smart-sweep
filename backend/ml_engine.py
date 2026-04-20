import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from backend.retention_logic import generate_retention_strategy

_df_cache = None
_rf_cache = None

def load_data(filepath='backend/churn_data.csv'):
    global _df_cache
    if _df_cache is not None:
        return _df_cache
    try:
        _df_cache = pd.read_csv(filepath)
        return _df_cache
    except FileNotFoundError:
        return None

def train_and_predict_churn(df):
    global _rf_cache
    """
    Trains a Random Forest classifier to predict Churn Risk.
    Returns the dataframe with predicted probabilities and feature importance.
    """
    if df is None or df.empty:
        return None

    # Features for ML Model
    features = ['Age', 'Tenure', 'Balance', 'NumProducts', 'IsActiveMember', 'SupportTickets']
    X = df[features]
    y = df['HistoricallyChurned']

    # Train Random Forest (Cache it)
    if _rf_cache is None:
        _rf_cache = RandomForestClassifier(n_estimators=10, random_state=42) # reduced from 50 for max performance
        _rf_cache.fit(X, y)

    # Predict Probability of Churn
    probabilities = _rf_cache.predict_proba(X)[:, 1] # Probability of Class 1 (Churn)
    
    # Store results dynamically
    df['ChurnProbability'] = probabilities
    
    # Extract top reason for churn risk using feature importance heuristic
    # (In a real enterprise app, we'd use SHAP, but a heuristic works for real-time hackathon speed)
    reasons = []
    for _, row in df.iterrows():
        if row['IsActiveMember'] == 0 and row['ChurnProbability'] > 0.4:
            reason = "Dormant Account"
        elif row['SupportTickets'] > 2 and row['ChurnProbability'] > 0.4:
            reason = "High Support Friction"
        elif row['Balance'] < 5000:
            reason = "Low Engagement (Balance)"
        else:
            reason = "Market Attrition / Competitor Offer"
        reasons.append(reason)
        
    df['PredictedChurnReason'] = reasons
    return df

def get_enterprise_dashboard_data():
    df = load_data()
    if df is None:
        return {"error": "Data not found"}
        
    df_scored = train_and_predict_churn(df)
    
    # Filter high risk customers (e.g., > 60% probability)
    high_risk_customers = df_scored[df_scored['ChurnProbability'] > 0.60].copy()
    
    # Generate individualized retention strategies using indigenous logic engine
    strategies = []
    for _, row in high_risk_customers.iterrows():
        strat = generate_retention_strategy(row['PredictedChurnReason'], row['Balance'], row['Tenure'])
        strategies.append(strat)
    high_risk_customers['RetentionStrategy'] = strategies
    
    # Format global metrics
    global_churn_rate = (len(high_risk_customers) / len(df_scored)) * 100
    at_risk_revenue = high_risk_customers['Balance'].sum()
    
    return {
        "metrics": {
            "total_customers": len(df_scored),
            "high_risk_count": len(high_risk_customers),
            "global_churn_rate": round(global_churn_rate, 1),
            "at_risk_revenue": float(at_risk_revenue)
        },
        "high_risk_profiles": high_risk_customers.sort_values(by='ChurnProbability', ascending=False).head(20).to_dict(orient='records')
    }
