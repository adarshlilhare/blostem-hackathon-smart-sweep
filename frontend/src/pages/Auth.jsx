import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Fingerprint } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      const res = await axios.post(`http://localhost:8000${endpoint}`, {
        username,
        password
      });
      // Store token (using username as mock token)
      localStorage.setItem('awm_token', isLogin ? res.data.token : res.data.username);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans">
      <div className="glass-card p-8 w-full max-w-md border-primary/20 border relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>

        <div className="mb-8 text-center relative z-10">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/30 mb-4">
             <Fingerprint className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Smart Sweep Engine</h1>
          <p className="text-sm text-gray-400">AI-Powered Wealth Optimization</p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. quant_user_01"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <button type="submit" className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2">
            <Shield className="w-5 h-5" /> {isLogin ? 'Login to Dashboard' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center relative z-10">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an ID? Register here." : "Already registered? Authenticate here."}
          </button>
        </div>

      </div>
    </div>
  );
}
