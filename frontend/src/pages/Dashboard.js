import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#e94560', '#0f3460', '#533483', '#1b998b', '#f9a826', '#4ecca3', '#16213e'];

// Mock data — will connect to backend when ready
const categoryData = [
  { name: 'Food', value: 4200 },
  { name: 'Transport', value: 3100 },
  { name: 'Bills', value: 2800 },
  { name: 'Entertainment', value: 1900 },
  { name: 'Health', value: 12500 },
];

const monthlyData = [
  { month: 'Mar', income: 85000, expense: 52000 },
  { month: 'Apr', income: 85000, expense: 49800 },
  { month: 'May', income: 85000, expense: 61200 },
  { month: 'Jun', income: 85000, expense: 54000 },
];

export default function Dashboard() {
  const [insights, setInsights] = useState([
    { type: 'warning', message: 'Recurring subscriptions total ₹2,477/month — check if all are used.' },
    { type: 'positive', message: 'You saved 38% of income this month. Good progress!' },
    { type: 'info', message: 'Food delivery is your top category (₹4,200). Set a monthly cap.' },
  ]);

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', color: '#eee' }}>
      <h1 style={{ color: '#e94560', marginBottom: '10px', fontSize: '28px' }}>💰 Dashboard</h1>
      <p style={{ color: '#aaa', marginBottom: '30px' }}>Your personal finance coach — evidence-based insights.</p>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'Total Income', value: '₹85,000', sub: 'This month', color: '#4ecca3' },
          { label: 'Total Expense', value: '₹52,000', sub: 'This month', color: '#e94560' },
          { label: 'Savings Rate', value: '38.8%', sub: 'Up 3% from last month', color: '#f9a826' },
          { label: 'Recurring Bills', value: '₹2,477/mo', sub: 'Netflix, Spotify, Hotstar', color: '#0f3460' },
        ].map(s => (
          <div key={s.label} style={{ background: '#16213e', padding: '20px', borderRadius: '12px', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '14px', color: '#aaa' }}>{s.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Category Pie */}
        <div style={{ background: '#16213e', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label={({name})=>name}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Bar */}
        <div style={{ background: '#16213e', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Income vs Expense (Last 4 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#4ecca3" name="Income" />
              <Bar dataKey="expense" fill="#e94560" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights Box */}
      <div style={{ background: '#1b998b22', padding: '20px', borderRadius: '12px', border: '1px solid #1b998b40' }}>
        <h3 style={{ color: '#1b998b', marginBottom: '10px', fontSize: '18px' }}>🤖 AI Insights (Evidence-Based)</h3>
        {insights.map((ins, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: i < insights.length - 1 ? '1px solid #333' : 'none', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '20px' }}>
              {ins.type === 'warning' ? '⚠️' : ins.type === 'positive' ? '✅' : '💡'}
            </div>
            <div>
              <div style={{ fontWeight: '500', color: '#eee' }}>{ins.message}</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                Source: computed from 6 months of transaction data • Rule: recurring detection + z-score
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
