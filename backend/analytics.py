import pandas as pd

def load_data(filepath='transactions.csv'):
    try:
        df = pd.read_csv(filepath)
        df['Date'] = pd.to_datetime(df['Date'])
        return df
    except FileNotFoundError:
        return None

def get_monthly_summary(df):
    """Calculates income, expenses, and surplus per month."""
    df['Month'] = df['Date'].dt.to_period('M')
    
    summary = df.groupby('Month').apply(
        lambda x: pd.Series({
            'Income': x[x['Type'] == 'Credit']['Amount'].sum(),
            'Expenses': abs(x[x['Type'] == 'Debit']['Amount'].sum()),
            'Surplus': x[x['Type'] == 'Credit']['Amount'].sum() + x[x['Type'] == 'Debit']['Amount'].sum() # Debit is negative
        })
    ).reset_index()
    summary['Month'] = summary['Month'].astype(str)
    return summary

def get_category_breakdown(df):
    """Calculates total expenses by category."""
    expenses = df[df['Type'] == 'Debit'].copy()
    # Amount is negative, take absolute value for display
    expenses['Amount'] = abs(expenses['Amount'])
    return expenses.groupby('Category')['Amount'].sum().reset_index()

def get_overall_metrics(df):
    summary = get_monthly_summary(df)
    total_income = summary['Income'].sum()
    total_expenses = summary['Expenses'].sum()
    avg_surplus = summary['Surplus'].mean()
    current_month_surplus = summary.iloc[-1]['Surplus'] if not summary.empty else 0
    
    return {
        'total_income': total_income,
        'total_expenses': total_expenses,
        'avg_surplus': avg_surplus,
        'current_month_surplus': current_month_surplus
    }
