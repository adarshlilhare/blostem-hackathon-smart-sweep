from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import hashlib
from pydantic import BaseModel
from typing import List

from backend.quant_engine import get_awm_dashboard_data
from backend import models, database
from backend.database import engine, get_db

# Create SQLite Database Tables automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Pydantic Schemas
class UserCreate(BaseModel):
    username: str
    password: str

class PortfolioSave(BaseModel):
    username: str # Simplistic token for hackathon setup
    name: str
    expected_return: float
    volatility: float
    risk_profile: str

class SimulationRequest(BaseModel):
    net_worth: int
    monthly_contrib: int
    horizon: int
    risk_score: int
    target_goal: int

# Auth Endpoints
@app.post("/api/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Success", "username": new_user.username}

@app.post("/api/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or db_user.hashed_password != get_password_hash(user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    return {"message": "Success", "token": user.username} # Using username as mock JWT token for hackathon speed

# Database Endpoints   
@app.post("/api/save_portfolio")
def save_portfolio(p: PortfolioSave, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == p.username).first()
    if not db_user:
        db_user = models.User(username=p.username, hashed_password="bypassed")
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
    db_port = models.Portfolio(
        name=p.name,
        expected_return=p.expected_return,
        volatility=p.volatility,
        risk_profile=p.risk_profile,
        owner_id=db_user.id
    )
    db.add(db_port)
    db.commit()
    return {"message": "Portfolio Saved to Database Successfully!"}

@app.get("/api/portfolios/{username}")
def get_portfolios(username: str, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == username).first()
    if not db_user:
        db_user = models.User(username=username, hashed_password="bypassed")
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
    return [
        {
            "id": p.id,
            "name": p.name,
            "expected_return": p.expected_return,
            "volatility": p.volatility,
            "risk_profile": p.risk_profile
        }
        for p in db_user.portfolios
    ]

# Engine Endpoint
@app.post("/api/simulate")
def simulate(request: SimulationRequest):
    user_state = {
        "current_net_worth": request.net_worth,
        "monthly_contribution": request.monthly_contrib,
        "investment_horizon_years": request.horizon,
        "behavioral_score": request.risk_score,
        "target_goal": request.target_goal
    }
    data = get_awm_dashboard_data(user_state)
    if "error" in data:
        raise HTTPException(status_code=404, detail="Data not found")
    return data

@app.get("/api/admin/all_data")
def get_all_data(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    result = []
    for u in users:
        portfolios = [
            {
                "id": p.id,
                "name": p.name,
                "expected_return": p.expected_return,
                "volatility": p.volatility,
                "risk_profile": p.risk_profile
            }
            for p in u.portfolios
        ]
        result.append({
            "id": u.id,
            "username": u.username,
            "portfolios_count": len(portfolios),
            "portfolios": portfolios
        })
    return {"users": result}

@app.delete("/api/admin/delete/{user_id}")
def delete_specific_user(user_id: int, db: Session = Depends(get_db)):
    db.query(models.Portfolio).filter(models.Portfolio.owner_id == user_id).delete()
    db.query(models.User).filter(models.User.id == user_id).delete()
    db.commit()
    return {"message": "Deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
