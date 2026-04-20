import random

def get_chat_response(message, dashboard_data):
    """
    Local Natural Language Generation (NLG) engine replacing external LLMs.
    Responds based solely on the mathematical outputs of the Local ML models.
    """
    message = message.lower()
    
    metrics = dashboard_data.get('metrics', {})
    persona = dashboard_data.get('persona', 'Unknown')
    sweep_recommendation = dashboard_data.get('sweep_recommendation', 'Savings Account')
    surplus = metrics.get('current_surplus', 0)
    anomalies = dashboard_data.get('recent_anomalies', [])
    
    # Keyword-based router with dynamic variable injection
    if "anomaly" in message or "fraud" in message or "suspicious" in message:
        if len(anomalies) > 0:
            return f"Our Isolation Forest ML model detected {len(anomalies)} anomalous transactions. The most severe was at {anomalies[-1]['Category']} for ${abs(anomalies[-1]['Amount']):.2f}."
        else:
            return "The Isolation Forest model shows your account is clean. No suspicious anomalies detected."
            
    elif "invest" in message or "sweep" in message or "advice" in message:
        return f"Based on our Random Forest Classifier, you are classified as a '{persona}'. With a surplus of ${surplus:.2f}, the optimal automated sweep vehicle for you is a {sweep_recommendation}."
        
    elif "burn rate" in message or "forecast" in message or "spend" in message:
        return f"Based on linear projection, your forecasted burn rate for next month is ${metrics.get('forecast_expenses', 0):.2f}."
        
    else:
        # Default fallback response utilizing ML insights
        responses = [
            f"As your local AI advisor, I've analyzed your data. Our Random Forest suggests investing your surplus in {sweep_recommendation}.",
            f"Hello! I am operating purely on local ML. I noticed you fall into the '{persona}' cluster algorithmically.",
            f"How can I help? Ask me about your anomalies, my investment recommendations, or your forecasted burn rate!"
        ]
        return random.choice(responses)
