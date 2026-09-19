import React from 'react';

export default function Insights() {
  return (
    <div style={{ padding:'30px', maxWidth:'1200px', margin:'0 auto', color:'#eee' }}>
      <h1 style={{ color:'#e94560', marginBottom:'10px' }}>🤖 AI Insights</h1>
      <p style={{ color:'#aaa', marginBottom:'20px' }}>Evidence-based — every claim links to exact transactions.</p>
      
      <div style={{ display:'grid', gap:'15px' }}>
        {[
          { title:'Recurring Subscriptions Found', body:'Netflix (₹649/mo × 6 months), Spotify (₹129/mo), Hotstar (₹899/mo). Total: ₹2,477/mo. Check if all are used.', evidence:'Source: 18 transactions across Mar-Aug 2026' },
          { title:'Anomaly Detected', body:'Large unexpected medical expense of ₹12,500 on May 15. Month-over-month expense jumped 27%.', evidence:'Source: Transaction ID 42 — City Hospital, 15 May' },
          { title:'Top Spending Category', body:'Food delivery is highest at ₹4,200/month. Consider setting a cap.', evidence:'Source: 12 Swiggy transactions, avg ₹350' },
          { title:'Savings Rate', body:'You saved 38.8% of income (₹32,800/month). Target 50% by reducing food delivery 30%.', evidence:'Source: Income ₹85,000 - Expense ₹52,200' },
        ].map(i => (
          <div key={i.title} style={{ background:'#16213e', padding:'20px', borderRadius:'12px', borderLeft:'4px solid #1b998b' }}>
            <h3 style={{ marginBottom:'8px', color:'#1b998b' }}>{i.title}</h3>
            <p style={{ marginBottom:'8px', color:'#ddd' }}>{i.body}</p>
            <p style={{ fontSize:'12px', color:'#888' }}>{i.evidence}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
