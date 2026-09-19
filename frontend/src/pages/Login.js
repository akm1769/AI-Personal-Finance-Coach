import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('85000');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMsg('Please enter email and password');
      return;
    }
    // Store simple auth state in localStorage
    localStorage.setItem('user', JSON.stringify({ email, name: name || 'Demo User', income: monthlyIncome }));
    setMsg('Success! Redirecting to dashboard...');
    setTimeout(() => {
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div style={{ minHeight:'85vh', display:'flex', justifyContent:'center', alignItems:'center', background:'#1a1a2e', color:'#eee', padding:'20px' }}>
      <div style={{ background:'#16213e', padding:'35px 30px', borderRadius:'16px', width:'100%', maxWidth:'420px', boxShadow:'0 12px 35px rgba(0,0,0,0.4)', border:'1px solid #0f3460' }}>
        <div style={{ textAlign:'center', marginBottom:'25px' }}>
          <div style={{ fontSize:'32px', marginBottom:'8px' }}>💰</div>
          <h2 style={{ color:'#e94560', margin:0, fontSize:'24px' }}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p style={{ color:'#8e9aaf', fontSize:'14px', marginTop:'6px' }}>
            {isRegister ? 'Sign up to start tracking your finances' : 'Log in to your AI Finance Coach'}
          </p>
        </div>

        {msg && (
          <div style={{ padding:'10px', background:'#4ecca322', color:'#4ecca3', border:'1px solid #4ecca366', borderRadius:'8px', fontSize:'13px', marginBottom:'15px', textAlign:'center' }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'15px' }}>
          {isRegister && (
            <div>
              <label style={{ fontSize:'12px', color:'#a2a9b8', display:'block', marginBottom:'5px' }}>Full Name</label>
              <input
                placeholder="e.g. Amogha Krishna"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #233554', background:'#0a192f', color:'#fff', outline:'none', boxSizing:'border-box' }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize:'12px', color:'#a2a9b8', display:'block', marginBottom:'5px' }}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #233554', background:'#0a192f', color:'#fff', outline:'none', boxSizing:'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize:'12px', color:'#a2a9b8', display:'block', marginBottom:'5px' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #233554', background:'#0a192f', color:'#fff', outline:'none', boxSizing:'border-box' }}
            />
          </div>

          {isRegister && (
            <div>
              <label style={{ fontSize:'12px', color:'#a2a9b8', display:'block', marginBottom:'5px' }}>Monthly Income (₹)</label>
              <input
                type="number"
                placeholder="85000"
                value={monthlyIncome}
                onChange={e => setMonthlyIncome(e.target.value)}
                style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #233554', background:'#0a192f', color:'#fff', outline:'none', boxSizing:'border-box' }}
              />
            </div>
          )}

          <button
            type="submit"
            style={{ width:'100%', padding:'13px', background:'#e94560', color:'#fff', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:'bold', cursor:'pointer', marginTop:'10px', transition:'background 0.2s' }}
          >
            {isRegister ? 'Sign Up & Continue' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign:'center', marginTop:'20px', fontSize:'13px', color:'#8e9aaf' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{ color:'#4ecca3', cursor:'pointer', fontWeight:'bold', textDecoration:'underline' }}
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </span>
        </div>
      </div>
    </div>
  );
}

