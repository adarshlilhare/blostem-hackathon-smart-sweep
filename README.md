# Smart Sweep & Explain Engine 🚀
*Blostem Builder Hackathon - Money Management Track*

🔗 **Live Deployment:** [https://blostem-hackathon-smart-sweep.vercel.app/](https://blostem-hackathon-smart-sweep.vercel.app/)

**Smart Sweep & Explain Engine** is an enterprise-grade Algorithmic Wealth Manager designed to democratize high-end quantitative finance. It continuously sweeps surplus cash into optimized portfolios and uses a transparent "Explain Engine" to make complex ML-driven investment decisions accessible to the everyday user.

---

## 💡 The Hackathon Pitch: Why This Stands Out

**1. Enterprise Asset Allocation, Not Retail Stock Picking**
Recommending specific "hot" stocks is risky behavior suited for retail day-trading apps. The *Smart Sweep Engine* uses **Modern Portfolio Theory (MPT)**—the rigorous mathematical framework used by Wall Street hedge funds and top-tier managers like Vanguard. It focuses on finding the statistically optimal asset allocation (balancing Tech Equities, Bonds, Gold, etc.) to maximize returns while strictly capping volatility, and then explains *why* it made that choice using AI.

**2. Advanced Monte Carlo Forecasting vs. Linear Math**
Basic finance apps use elementary compound interest calculators that draw a fake, straight line to the future. The stock market doesn't work that way. Our engine uses a robust **Monte Carlo Simulation Model** that runs thousands of randomized mathematical scenarios based on historical volatility and drift. It aggregates these parallel universes into exact statistical percentiles (95th Best Case, Median, 5th Worst Case) to accurately predict your Financial Independence (FIRE) milestone.

---

## 🌟 Key Features

1. **Automated Wealth Sweeps**: Tracks current surplus and automatically suggests "sweeping" into an optimal vehicle (e.g., Equities, Bonds, Gold) using Modern Portfolio Theory (MPT) constraints.
2. **Explain Engine (NLG)**: Replaces opaque "black-box" trading algorithms with clear, Natural Language Generation (NLG) insights. It explains *why* the algorithm chose a specific asset allocation (e.g., maximizing Sharpe Ratio while capping volatility).
3. **Monte Carlo FIRE Simulator**: Runs complex probability calculations (5th, 50th, 95th percentiles) to forecast portfolio growth and calculate exactly when the user will hit Financial Independence (FIRE).
4. **Frictionless Demo Dashboard**: A beautiful, glassmorphism-based React UI that deliberately bypasses tedious authentication for an immediate "out-of-the-box" experience for hackathon judges.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS (for dynamic and responsive UI)
- **Backend**: FastAPI (Python), SQLAlchemy, Pandas, Numpy
- **Database**: SQLite (Pre-seeded with mock data for instant demoing)
- **Engine**: Custom MPT Quant Engine and Local ML pipelines for localized Natural Language Generation without relying on external LLMs.

---

## 🚀 Live Demo & How to Test

**Live Vercel Link:** [https://blostem-hackathon-smart-sweep.vercel.app/](https://blostem-hackathon-smart-sweep.vercel.app/)

*⚠️ Important Note for Judges:* 
Because our Machine Learning models and Quant Engine run natively in Python (to avoid external APIs), the backend must be running locally for the Vercel frontend to fetch data. 

**Quick Start Instructions:**
1. Download or clone this repository to your local machine.
2. Double-click the **`run.bat`** file in the root directory.
3. The AI Backend will securely spin up on port `8000`.
4. You can now use the live **Vercel Link** above, OR use the local dashboard at `http://localhost:5173`. 

*(Note: If your browser warns about "Insecure Content" on Vercel, simply allow it. This happens because the secure Vercel site is talking to your local backend.)*

---

## 📂 Project Structure

- `/backend/`: FastAPI application, Machine Learning models (`ml_engine.py`), and the custom Quant Engine (`quant_engine.py`).
- `/frontend/`: React components, state management, and Tailwind styling.
- `blostem.db`: Pre-populated SQLite database so the dashboard comes to life instantly.
- `run.bat`: The master launch script.
