import React from 'react';
import NotificationBell from '../components/NotificationBell';

const Dashboard = () => {
  const userId = localStorage.getItem('userId') || 'demo-user';

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: '#1e1e2e', borderBottom: '1px solid #3f3f5a' }}>
        <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#818cf8' }}>🚗 Vehicle Maintenance</h1>
        <NotificationBell userId={userId} />
      </nav>

      {/* Main Content */}
      <main style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ color: '#c4b5fd' }}>Dashboard</h2>
        <p style={{ color: '#94a3b8' }}>Welcome! Manage your vehicles and maintenance schedules here.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
          {['My Vehicles', 'Upcoming Service', 'Completed', 'Notifications'].map((card) => (
            <div key={card} style={{ background: '#1e1e2e', border: '1px solid #3f3f5a', borderRadius: '12px', padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
              <h3 style={{ margin: 0, color: '#818cf8', fontSize: '1rem' }}>{card}</h3>
              <p style={{ color: '#64748b', margin: '8px 0 0', fontSize: '0.85rem' }}>View details →</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
