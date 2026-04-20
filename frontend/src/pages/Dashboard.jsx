import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, PieChart as PieChartIcon, Save, Database, Target, BrainCircuit } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('awm_token') || "Demo User";

  const [data, setData] = useState({
      ml_insights: { assigned_risk_profile: "—", optimal_portfolio_return: 0, optimal_portfolio_volatility: 0, fire_milestone_year: "—", explanation: "" },
      asset_allocation: [],
      monte_carlo_simulation: []
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [netWorth, setNetWorth] = useState(100000);
  const [monthlyContrib, setMonthlyContrib] = useState(2500);
  const [horizon, setHorizon] = useState(20);
  const [riskScore, setRiskScore] = useState(70);
  const [targetGoal, setTargetGoal] = useState(2000000);

  const runSimulation = () => {
    setIsSimulating(true);
    axios.post('http://localhost:8000/api/simulate', {
      net_worth: netWorth, monthly_contrib: monthlyContrib,
      horizon, risk_score: riskScore, target_goal: targetGoal
    })
    .then(res => { setData(res.data); setIsSimulating(false); })
    .catch(() => { setIsSimulating(false); });
  };

  const savePortfolio = () => {
    setIsSaving(true);
    setSaveMsg('');
    axios.post('http://localhost:8000/api/save_portfolio', {
      username: token,
      name: `Portfolio #${Math.floor(Math.random() * 9000) + 1000}`,
      expected_return: data.ml_insights.optimal_portfolio_return,
      volatility: data.ml_insights.optimal_portfolio_volatility,
      risk_profile: data.ml_insights.assigned_risk_profile
    })
    .then(() => {
      setSaveMsg('✓ Saved! Redirecting to saved portfolios...');
      setIsSaving(false);
      setTimeout(() => navigate('/database'), 1200);
    })
    .catch(() => {
      setSaveMsg('✗ Save failed. Is backend running?');
      setIsSaving(false);
    });
  };

  useEffect(() => {
    const t = setTimeout(runSimulation, 300);
    return () => clearTimeout(t);
  }, [netWorth, monthlyContrib, horizon, riskScore, targetGoal]);

  const { ml_insights, asset_allocation, monte_carlo_simulation } = data;

  const COLORS = ['#3b82f6', '#f43f5e', '#8b5cf6', '#f59e0b', '#10b981'];

  return (
    <div className="min-h-screen bg-[#0f1117] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Nav */}
      <nav className="border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Smart Sweep & Explain Engine</h1>
          <p className="text-xs text-gray-500 mt-0.5">Algorithmic Wealth Optimization</p>
        </div>
        <div className="flex gap-3">
          <Link to="/database" className="text-sm px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-300 flex items-center gap-2">
            <Database className="w-4 h-4" /> Saved Database
          </Link>
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar — Controls */}
        <aside className="w-80 border-r border-white/5 p-6 space-y-6 min-h-[calc(100vh-60px)]">
          
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Starting Capital</label>
            <div className="text-2xl font-bold mb-2">${netWorth.toLocaleString()}</div>
            <input type="range" min="1000" max="1000000" step="5000" value={netWorth}
              onChange={e => setNetWorth(+e.target.value)}
              className="w-full accent-blue-500" />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Monthly Contribution</label>
            <div className="text-2xl font-bold mb-2">${monthlyContrib.toLocaleString()}</div>
            <input type="range" min="0" max="25000" step="500" value={monthlyContrib}
              onChange={e => setMonthlyContrib(+e.target.value)}
              className="w-full accent-blue-500" />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Investment Horizon</label>
            <div className="text-2xl font-bold mb-2">{horizon} years</div>
            <input type="range" min="5" max="40" step="1" value={horizon}
              onChange={e => setHorizon(+e.target.value)}
              className="w-full accent-blue-500" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-gray-500 font-medium">Risk Score</label>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                ml_insights.assigned_risk_profile === 'Aggressive' ? 'bg-red-500/20 text-red-400' :
                ml_insights.assigned_risk_profile === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>{ml_insights.assigned_risk_profile}</span>
            </div>
            <div className="text-2xl font-bold mb-2">{riskScore}<span className="text-sm text-gray-600">/100</span></div>
            <input type="range" min="0" max="100" step="1" value={riskScore}
              onChange={e => setRiskScore(+e.target.value)}
              className="w-full accent-blue-500" />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Target Goal ($)</label>
            <input type="number" value={targetGoal} onChange={e => setTargetGoal(+e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-lg font-bold outline-none focus:border-blue-500 transition" />
          </div>

          <div className="pt-4 border-t border-white/5">
            <button onClick={savePortfolio} disabled={isSaving}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save to Database'}
            </button>
            {saveMsg && (
              <p className={`text-xs mt-2 text-center font-medium ${saveMsg.startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}`}>
                {saveMsg}
              </p>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-8 space-y-6 transition-opacity ${isSimulating ? 'opacity-40' : ''}`}>
          
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
              <p className="text-xs text-gray-500 mb-1">Expected Return</p>
              <p className="text-2xl font-bold text-emerald-400">{ml_insights.optimal_portfolio_return}%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
              <p className="text-xs text-gray-500 mb-1">Portfolio Volatility</p>
              <p className="text-2xl font-bold text-orange-400">{ml_insights.optimal_portfolio_volatility}%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
              <p className="text-xs text-gray-500 mb-1">Risk Profile</p>
              <p className="text-2xl font-bold">{ml_insights.assigned_risk_profile}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
              <p className="text-xs text-gray-500 mb-1">FIRE Milestone</p>
              <p className="text-2xl font-bold text-blue-400">
                {ml_insights.fire_milestone_year === "Never" ? "Not Reachable" : `Year ${ml_insights.fire_milestone_year}`}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-3 gap-6">
            {/* Monte Carlo Chart */}
            <div className="col-span-2 bg-white/5 rounded-xl p-6 border border-white/5">
              <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Monte Carlo Simulation
              </h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monte_carlo_simulation}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#333" tickFormatter={t => `Yr ${t}`} tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#333" tickFormatter={t => `$${t >= 1000 ? (t/1000).toFixed(0) + 'k' : t}`} tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8 }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="bestCase" stroke="#334155" fill="none" strokeWidth={1} strokeDasharray="4 4" name="Best Case (95th)" />
                    <Area type="monotone" dataKey="worstCase" stroke="#334155" fill="none" strokeWidth={1} strokeDasharray="4 4" name="Worst Case (5th)" />
                    <Area type="monotone" dataKey="median" stroke="#3b82f6" fill="url(#grad)" strokeWidth={3} name="Median Path" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
              <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-emerald-500" /> Asset Allocation (MPT)
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={asset_allocation} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                      {asset_allocation.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8 }} formatter={v => `${v}%`} itemStyle={{ color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {asset_allocation.map((a, i) => (
                  <div key={a.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-gray-400">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></span>
                      {a.name}
                    </span>
                    <span className="font-semibold text-white">{a.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Explain Engine */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/5">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" /> Explain Engine — Why This Allocation?
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {ml_insights.explanation || "Adjust the sliders to generate an AI explanation of your portfolio strategy."}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
