def generate_retention_strategy(churn_reason, balance, tenure):
    """
    Indigenous rule-based Natural Language rule engine.
    Crafts hyper-personalized retention offers without using external APIs.
    """
    
    if churn_reason == "High Support Friction":
        return {
            "action": "Immediate Escalation",
            "offer": "Assign Dedicated Platinum Support Manager",
            "email_copy": "We noticed you've had to contact support frequently. To ensure your experience is flawless going forward, we are upgrading you to our Priority Support tier for free."
        }
        
    elif churn_reason == "Dormant Account":
        if balance > 50000:
            return {
                "action": "Wealth Marketing",
                "offer": "Exclusive 5.5% High Yield Deposit Preview",
                "email_copy": "Your funds aren't working hard enough. Activate your account this week to unlock an exclusive invite-only 5.5% High Yield Savings rate."
            }
        else:
            return {
                "action": "Engagement Trigger",
                "offer": "Waive Next 3 Months Fees",
                "email_copy": "We miss you at Blostem! Log in today, and we'll automatically waive your account maintenance fees for the next 90 days."
            }
            
    elif churn_reason == "Low Engagement (Balance)":
        if tenure > 24:
            return {
                "action": "Loyalty Reward",
                "offer": "$100 Direct Deposit Bonus",
                "email_copy": f"Thank you for being with us for {tenure} months. Switch your primary direct deposit to Blostem this month and receive a $100 loyalty cash bonus."
            }
        else:
            return {
                "action": "Cross-sell",
                "offer": "0% Intro APR Credit Card",
                "email_copy": "Maximize your cash flow. Pre-approved for the Blostem Platinum Card with 0% Intro APR for 18 months."
            }
            
    else:
        return {
            "action": "General Outreach",
            "offer": "Free Financial Advisory Call",
            "email_copy": "Ensure your financial health is on track. Schedule a free 15-minute consultation with a Blostem Wealth Advisor today."
        }
