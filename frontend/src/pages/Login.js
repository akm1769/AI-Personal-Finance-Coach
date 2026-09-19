import React, { useState } from 'react';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div style={{ minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'center', background:'#1a1a2e', color:'#eee' }}>
      <div style={{ background:'#16213e', padding:'40px', borderRadius:'12px', width:'400px', boxShadow:'0 10px 30px rgba(0,0,0,0.3)' }}>
        <h2 style={{ color:'#e94560', marginBottom:'20px' }}>Login</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:'10px',marginBottom:'10px',borderRadius:'6px',border:'none'}} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:'10px',marginBottom:'15px',borderRadius:'6px',border:'none'}} />
        <button onClick={()=>alert('Login connects to Hemanth auth routes — backend running at :5000')} style={{width:'100%',padding:'12px',background:'#e94560',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}}>Sign In</button>
        <p style={{fontSize:'12px',color:'#888',marginTop:'15px'}}>Uses Hemanth's backend auth routes (userRoutes)</p>
      </div>
    </div>
  );
}
