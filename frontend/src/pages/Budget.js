import React from 'react';
export default function Budget() {
  return (
    <div style={{ padding:'30px', maxWidth:'1200px', margin:'0 auto', color:'#eee' }}>
      <h1 style={{ color:'#e94560', marginBottom:'10px' }}>🎯 Budget Goals</h1>
      <p style={{ color:'#aaa', marginBottom:'20px' }}>50/30/20 split — edit caps per category.</p>
      <div style={{ background:'#16213e', padding:'20px', borderRadius:'12px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'15px' }}>
        {[
          { cat:'Food', cap:8000, spent:4200, color:'#e94560' },
          { cat:'Transport', cap:3500, spent:3100, color:'#0f3460' },
          { cat:'Bills', cap:3000, spent:2800, color:'#16213e' },
          { cat:'Entertainment', cap:2500, spent:1900, color:'#533483' },
        ].map(b => (
          <div key={b.cat} style={{ background:'#1a1a2e', padding:'15px', borderRadius:'8px', borderTop:`3px solid ${b.color}` }}>
            <div style={{ fontWeight:'bold', marginBottom:'5px' }}>{b.cat}</div>
            <div style={{ fontSize:'12px', color:'#aaa' }}>Cap: ₹{b.cap} • Spent: ₹{b.spent}</div>
            <div style={{ height:'10px', background:'#333', borderRadius:'5px', marginTop:'8px', overflow:'hidden' }}>
              <div style={{ width:`${(b.spent/b.cap)*100}%`, height:'100%', background:b.color, borderRadius:'5px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
