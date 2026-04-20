import pandas as pd
import numpy as np
from backend.data_generator import generate_user_financials

_market_df_cache = None

def load_market_data(filepath='backend/market_returns.csv'):
    global _market_df_cache
    if _market_df_cache is not None:
        return _market_df_cache
    try:
        _market_df_cache = pd.read_csv(filepath, index_col=0)
        return _market_df_cache
    except FileNotFoundError:
        return None

def analyze_risk_profile(behavioral_score):
    """ Algorithmically determines risk profile from the user's score. """
    if behavioral_score < 40:
        return "Conservative"
    elif behavioral_score < 70:
        return "Moderate"
    else:
        return "Aggressive"

def optimize_portfolio(market_returns, risk_profile):
    """
    Implements a brute-force Modern Portfolio Theory (MPT) optimizer.
    Generates thousands of random weight combinations to find the highest Sharpe Ratio
    constrained by the user's maximum allowable volatility for their risk profile.
    """
    if market_returns is None or market_returns.empty:
        return {"Equities": 60, "Bonds": 30, "Gold": 10}
        
    num_portfolios = 500 # Optimized for lightweight processing
    num_assets = len(market_returns.columns)
    
    # Calculate annualized mean returns and covariance matrix
    mean_returns = market_returns.mean() * 12
    cov_matrix = market_returns.cov() * 12
    risk_free_rate = 0.02
    
    results = np.zeros((3, num_portfolios))
    weights_record = []
    
    for i in range(num_portfolios):
        weights = np.random.random(num_assets)
        weights /= np.sum(weights)
        weights_record.append(weights)
        
        # Portfolio Return
        portfolio_return = np.sum(weights * mean_returns)
        # Portfolio Volatility
        portfolio_std_dev = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
        
        results[0,i] = portfolio_return
        results[1,i] = portfolio_std_dev
        results[2,i] = (portfolio_return - risk_free_rate) / portfolio_std_dev # Sharpe
        
    # Map Risk Profile to max volatility threshold
    vol_constraints = {"Conservative": 0.08, "Moderate": 0.12, "Aggressive": 0.25}
    max_vol = vol_constraints.get(risk_profile, 0.15)
    
    # Filter portfolios meeting the constraint
    valid_idx = np.where(results[1] <= max_vol)[0]
    
    if len(valid_idx) == 0:
        # Fallback if no portfolio meets constraint (extremely strict)
        best_idx = np.argmin(results[1])
    else:
        # Find highest Sharpe ratio among valid portfolios
        subset_sharpes = results[2, valid_idx]
        best_subset_idx = np.argmax(subset_sharpes)
        best_idx = valid_idx[best_subset_idx]
        
    optimal_weights = weights_record[best_idx]
    
    # Convert weights to percentage dictionary
    allocation = {
        col: round(weight * 100, 1) 
        for col, weight in zip(market_returns.columns, optimal_weights)
    }
    
    return allocation, results[0, best_idx], results[1, best_idx]

def run_monte_carlo_simulation(initial_balance, monthly_contrib, expected_return, volatility, target_goal, years=20, sims=50):
    """
    Runs Monte Carlo simulation of future portfolio value path.
    Returns the median, 95th, and 5th percentile paths over time.
    """
    months = years * 12
    simulated_paths = np.zeros((sims, months))
    
    m_return = expected_return / 12
    m_vol = volatility / np.sqrt(12)
    
    for i in range(sims):
        balance = initial_balance
        path = []
        for month in range(months):
            # Apply geometric brownian motion step for asset return + fixed contribution
            market_shock = np.random.normal(m_return, m_vol)
            balance = balance * (1 + market_shock) + monthly_contrib
            path.append(balance)
        simulated_paths[i, :] = path
        
    # Calculate statistical percentiles across the simulations
    median_path = np.percentile(simulated_paths, 50, axis=0)
    top_path = np.percentile(simulated_paths, 95, axis=0)
    bottom_path = np.percentile(simulated_paths, 5, axis=0)
    
    # Calculate FIRE Milestone (Year cross)
    milestone_year = "Never"
    for m_idx, med_val in enumerate(median_path):
        if med_val >= target_goal:
            milestone_year = round((m_idx + 1) / 12, 1)
            break
    
    # Formatting for Recharts
    chart_data = []
    for m in range(0, months, 12): # Yearly intervals to compress data sent to UI
        year_idx = m // 12
        chart_data.append({
            "year": year_idx,
            "median": round(median_path[m]),
            "bestCase": round(top_path[m]),
            "worstCase": round(bottom_path[m])
        })
        
    # Add final month
    chart_data.append({
        "year": years,
        "median": round(median_path[-1]),
        "bestCase": round(top_path[-1]),
        "worstCase": round(bottom_path[-1])
    })
        
    return chart_data, milestone_year

def get_awm_dashboard_data(user_state):
    market_df = load_market_data()
    if market_df is None:
        return {"error": "Market data missing"}
    
    risk_profile = analyze_risk_profile(user_state['behavioral_score'])
    
    # 1. Run Modern Portfolio Theory optimization
    opt_allocation, exp_ret, expected_vol = optimize_portfolio(market_df, risk_profile)
    
    # 2. Run Monte Carlo simulation based on those exact mathematical params
    simulation_data, milestone = run_monte_carlo_simulation(
        initial_balance=user_state['current_net_worth'],
        monthly_contrib=user_state['monthly_contribution'],
        expected_return=exp_ret,
        volatility=expected_vol,
        target_goal=user_state.get('target_goal', 1000000),
        years=user_state['investment_horizon_years']
    )
    
    # 3. Generate Explain Engine Insight
    top_asset = max(opt_allocation, key=opt_allocation.get)
    explanation = f"Based on your {risk_profile} profile ({user_state['behavioral_score']}/100 risk score), the ML Explain Engine optimized heavily into {top_asset} to maximize Sharpe Ratio while strictly capping risk algorithms at {round(expected_vol * 100, 1)}% volatility."

    return {
        "user": user_state,
        "ml_insights": {
            "assigned_risk_profile": risk_profile,
            "optimal_portfolio_return": round(exp_ret * 100, 2),
            "optimal_portfolio_volatility": round(expected_vol * 100, 2),
            "fire_milestone_year": milestone,
            "explanation": explanation
        },
        "asset_allocation": [
            {"name": k, "value": v} for k, v in opt_allocation.items()
        ],
        "monte_carlo_simulation": simulation_data
    }
