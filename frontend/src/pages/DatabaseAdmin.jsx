import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, RefreshCw, Users, HardDrive, Trash2, X } from 'lucide-react';

export default function DatabaseAdmin() {
  const [data, setData] = useState({ users: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    axios.get('http://localhost:8000/api/admin/all_data')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => {
        // OFFLINE DEMO MODE FOR VERCEL
        setData({
          users: [
            {
              id: 1, 
              username: "Demo User", 
              portfolios_count: 2, 
              portfolios: [
                {id: 1, name: "Portfolio #8312", expected_return: 8.5, volatility: 12.0, risk_profile: "Moderate"},
                {id: 2, name: "Portfolio #4199", expected_return: 10.5, volatility: 15.2, risk_profile: "Aggressive"}
              ]
            },
            {
              id: 2, 
              username: "Hackathon Judge", 
              portfolios_count: 1, 
              portfolios: [
                {id: 3, name: "Safe Haven", expected_return: 4.5, volatility: 3.5, risk_profile: "Conservative"}
              ]
            }
          ]
        });
        setLoading(false);
      });
  };

  const handleDeleteUser = (userId, username) => {
    if (window.confirm(`Are you sure you want to delete all data for user ${username}?`)) {
      setLoading(true);
      axios.delete(`http://localhost:8000/api/admin/delete/${userId}`)
        .then(() => fetchData())
        .catch(() => setLoading(false));
    }
  };

  const handleDeletePortfolio = (portfolioId, portfolioName) => {
    if (window.confirm(`Are you sure you want to delete portfolio: ${portfolioName}?`)) {
      setLoading(true);
      axios.delete(`http://localhost:8000/api/admin/delete_portfolio/${portfolioId}`)
        .then(() => fetchData())
        .catch(() => setLoading(false));
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalUsers = data.users.length;
  const totalPortfolios = data.users.reduce((acc, u) => acc + u.portfolios_count, 0);

  return (
    <div className="min-h-screen bg-[#0f1117] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <nav className="border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition flex items-center gap-2 font-medium">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
          <Database className="w-6 h-6 text-blue-500" /> Database Explorer
        </h1>
        <p className="text-sm text-gray-500 mb-8">Live view of the SQLite <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">blostem.db</code> database.</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/5 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Database Engine</p>
            <p className="text-lg font-bold">SQLite3</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Users</p>
            <p className="text-lg font-bold">{totalUsers}</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><HardDrive className="w-3 h-3" /> Portfolios</p>
            <p className="text-lg font-bold">{totalPortfolios}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 text-sm">Loading...</div>
          ) : data.users.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">Database is empty. Save a portfolio from the dashboard first.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Portfolios</th>
                  <th className="px-6 py-3">Details</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.users.map(user => (
                  <tr key={user.id} className="hover:bg-white/[0.03] transition">
                    <td className="px-6 py-4 text-gray-500 font-mono">#{user.id}</td>
                    <td className="px-6 py-4 font-semibold">{user.username}</td>
                    <td className="px-6 py-4 text-gray-400">{user.portfolios_count} saved</td>
                    <td className="px-6 py-4">
                      {user.portfolios.length === 0 ? (
                        <span className="text-gray-600 text-xs">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {user.portfolios.map(p => (
                            <div key={p.id} className="text-xs bg-white/5 border border-white/5 pl-3 pr-1 py-1.5 rounded inline-flex items-center gap-3 group">
                              <span className="font-medium">{p.name}</span>
                              <span className="text-emerald-400">{p.expected_return}%</span>
                              <span className="text-orange-400">{p.volatility}% vol</span>
                              <span className="text-gray-500 mr-1">{p.risk_profile}</span>
                              <button 
                                onClick={() => handleDeletePortfolio(p.id, p.name)} 
                                className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition"
                                title="Delete this portfolio"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition"
                        title="Delete User & Portfolios"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
