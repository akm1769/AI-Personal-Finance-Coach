import React, { useState } from 'react';

export default function Transactions() {
  const [items, setItems] = useState([
    { id:1, merchant:'Swiggy', category:'Food', amount:425, type:'expense', date:'2026-03-10' },
    { id:2, merchant:'Employer', category:'Salary', amount:85000, type:'income', date:'2026-03-01' },
    { id:3, merchant:'Netflix', category:'Entertainment', amount:649, type:'expense', date:'2026-03-03' },
  ]);
  const [form, setForm] = useState({ merchant:'', category:'Food', amount:'', type:'expense' });

  const handleAdd = () => {
    setItems([...items, { id: Date.now(), ...form, amount: Number(form.amount), date: new Date().toISOString().split('T')[0] }]);
    setForm({ merchant:'', category:'Food', amount:'', type:'expense' });
  };

  return (
    <div style={{ padding:'30px', maxWidth:'1200px', margin:'0 auto', color:'#eee' }}>
      <h1 style={{ color:'#e94560', marginBottom:'10px' }}>📋 Transactions</h1>

      {/* Add Form */}
      <div style={{ background:'#16213e', padding:'20px', borderRadius:'12px', marginBottom:'20px' }}>
        <h3>Add New</h3>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'10px' }}>
          <input placeholder="Merchant" value={form.merchant} onChange={e=>setForm({...form,merchant:e.target.value})} style={{padding:'8px', borderRadius:'6px', border:'none', flex:'1'}} />
          <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{padding:'8px', borderRadius:'6px', border:'none'}}>
            {['Food','Transport','Bills','Entertainment','Health','Education','Salary'].map(c=> <option key={c}>{c}</option>)}
          </select>
          <input placeholder="Amount (₹)" type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} style={{padding:'8px', borderRadius:'6px', border:'none', width:'120px'}} />
          <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{padding:'8px', borderRadius:'6px', border:'none'}}>
            <option>expense</option><option>income</option>
          </select>
        </div>
        <button onClick={handleAdd} style={{padding:'8px 20px', background:'#e94560', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer'}}>Add</button>
      </div>

      {/* Table */}
      <table style={{ width:'100%', borderCollapse:'collapse', background:'#16213e', borderRadius:'12px', overflow:'hidden' }}>
        <thead style={{ background:'#0f3460', color:'#fff' }}>
          <tr><th style={{padding:'10px',textAlign:'left'}}>Merchant</th><th>Category</th><th>Type</th><th>Amount</th><th>Date</th></tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id} style={{ borderBottom:'1px solid #333' }}>
              <td style={{padding:'10px'}}>{i.merchant}</td>
              <td>{i.category}</td>
              <td style={{color:i.type==='income'?'#4ecca3':'#e94560'}}>{i.type}</td>
              <td>₹{i.amount}</td>
              <td>{i.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
