import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Activity, Target } from 'lucide-react';

export default function Portfolios() {
  const token = localStorage.getItem('awm_token') || "Demo User";
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/portfolios/${token}`)
      .then(res => { setPortfolios(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0f1117] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <nav className="border-b border-white/5 px-8 py-4">
        <Link to="/" className="text-sm text-gray-400 hover:text-white flex items-center gap-2 w-max transition">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold mb-1">Saved Portfolios</h1>
        <p className="text-sm text-gray-500 mb-8">All portfolio strategies you've saved to the SQLite database.</p>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : portfolios.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">No portfolios saved yet. Go back to the dashboard, adjust the sliders, and click "Save to Database".</p>
          </div>
        ) : (
          <div className="space-y-4">
            {portfolios.map(p => (
              <div key={p.id} className="bg-white/5 border border-white/5 rounded-xl p-6 flex items-center justify-between hover:bg-white/[0.07] transition">
                <div>
                  <h3 className="font-semibold text-white">{p.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">ID: {p.id} · Risk: {p.risk_profile}</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Return</p>
                    <p className="text-lg font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="w-4 h-4" />{p.expected_return}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Volatility</p>
                    <p className="text-lg font-bold text-orange-400 flex items-center gap-1"><Activity className="w-4 h-4" />{p.volatility}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Profile</p>
                    <p className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      p.risk_profile === 'Aggressive' ? 'bg-red-500/20 text-red-400' :
                      p.risk_profile === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>{p.risk_profile}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
