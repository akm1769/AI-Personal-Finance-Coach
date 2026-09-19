import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 30px',
  background: '#16213e',
  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
};

const logoStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#e94560',
};

const linksStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  listStyle: 'none',
};

const linkStyle = {
  color: '#eee',
  textDecoration: 'none',
  fontSize: '15px',
  transition: 'color 0.3s',
};

export default function Navbar() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // If not logged in, don't show the inner links
  if (!user) {
    return (
      <nav style={navStyle}>
        <div style={logoStyle}>💰 F1 Finance Coach</div>
        <ul style={linksStyle}>
          <li>
            <Link to="/login" style={{ ...linkStyle, background: '#e94560', padding: '7px 18px', borderRadius: '20px', color: '#fff', fontWeight: 'bold' }}>
              Sign In
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>💰 F1 Finance Coach</div>
      <ul style={linksStyle}>
        <li><Link to="/dashboard" style={linkStyle}>Dashboard</Link></li>
        <li><Link to="/transactions" style={linkStyle}>Transactions</Link></li>
        <li><Link to="/insights" style={linkStyle}>AI Insights</Link></li>
        <li><Link to="/budget" style={linkStyle}>Budget</Link></li>
        <li style={{ color: '#4ecca3', fontSize: '14px', marginLeft: '10px' }}>
          👤 {user.name || user.email}
        </li>
        <li>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid #e94560',
              color: '#e94560',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

