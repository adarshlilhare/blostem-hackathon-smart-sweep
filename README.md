# Smart Sweep & Explain Engine 🚀
*Blostem Builder Hackathon - Money Management Track*

**Smart Sweep & Explain Engine** is an enterprise-grade Algorithmic Wealth Manager designed to democratize high-end quantitative finance. It continuously sweeps surplus cash into optimized portfolios and uses a transparent "Explain Engine" to make complex ML-driven investment decisions accessible to the everyday user.

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

## 🚀 How to Run the App (One-Click Setup)

We built this project to run seamlessly for judges and mentors:

1. Open this repository on your local machine.
2. Double-click the **`run.bat`** file in the root directory.
3. That's it! 
    - The backend FastAPI server will spin up on port `8000`.
    - The Vite frontend will automatically launch on port `5173`.
4. Open your browser to: [http://localhost:5173](http://localhost:5173)

*Note: Authentication has been intentionally bypassed for hackathon demo purposes so you can jump right into the analytics dashboard.*

---

## 📂 Project Structure

- `/backend/`: FastAPI application, Machine Learning models (`ml_engine.py`), and the custom Quant Engine (`quant_engine.py`).
- `/frontend/`: React components, state management, and Tailwind styling.
- `blostem.db`: Pre-populated SQLite database so the dashboard comes to life instantly.
- `run.bat`: The master launch script.
