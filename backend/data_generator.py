import pandas as pd
import numpy as np
import os

def generate_market_data():
    """
    Simulates ~5 years of monthly returns for 3 asset classes:
    Equities (Stocks), Fixed Income (Bonds), Commodities (Gold)
    """
    np.random.seed(42)
    months = 60
    
    # Define expected annual returns and volatility (std dev)
    assets = {
        'US Tech Equities': {'mu': 0.12, 'vol': 0.20},
        'Emerging Markets': {'mu': 0.08, 'vol': 0.18},
        'Gov Bonds': {'mu': 0.04, 'vol': 0.05},
        'Crypto': {'mu': 0.40, 'vol': 0.60},
        'Gold': {'mu': 0.06, 'vol': 0.10}
    }
    
    # Generate monthly returns
    dates = pd.date_range(start='2019-01-01', periods=months, freq='M')
    data = {}
    
    for asset, params in assets.items():
        # Convert annual to monthly
        m_mu = params['mu'] / 12
        m_vol = params['vol'] / np.sqrt(12)
        returns = np.random.normal(m_mu, m_vol, months)
        data[asset] = returns

    df = pd.DataFrame(data, index=dates)
    
    # Create correlation 
    # (Stocks & Bonds slightly negative, Gold independent)
    return df

def generate_user_financials():
    """ Simulates user financial state for the Robo-Advisor """
    return {
        "current_net_worth": 25000,
        "monthly_contribution": 1000,
        "investment_horizon_years": 20,
        "behavioral_score": 75 # Out of 100. Lower means conservative, higher means aggressive.
    }

if __name__ == "__main__":
    df_market = generate_market_data()
    script_dir = os.path.dirname(os.path.abspath(__file__))
    market_path = os.path.join(script_dir, 'market_returns.csv')
    df_market.to_csv(market_path)
    print(f"Generated 5 years of historical market returns at {market_path}")
