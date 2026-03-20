import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { FaTachometerAlt, FaVoteYea, FaFolderOpen, FaFolderMinus, FaUsers } from 'react-icons/fa';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Load stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <h1 style={{ fontSize: '2rem', color: 'var(--dark-green)', marginBottom: '2rem' }}>
          <FaTachometerAlt style={{ marginRight: '0.75rem' }} />
          Admin Dashboard
        </h1>

        <div className="grid grid-4">
          <div className="stats-card primary" style={{ position: 'relative' }}>
            <div className="stats-card-value">{stats?.totalReferendums || 0}</div>
            <div className="stats-card-label">Total Referendums</div>
            <FaVoteYea className="stats-card-icon" />
          </div>

          <div className="stats-card" style={{ position: 'relative' }}>
            <div className="stats-card-value">{stats?.openReferendums || 0}</div>
            <div className="stats-card-label">Open Referendums</div>
            <FaFolderOpen className="stats-card-icon" />
          </div>

          <div className="stats-card" style={{ position: 'relative' }}>
            <div className="stats-card-value">{stats?.closedReferendums || 0}</div>
            <div className="stats-card-label">Closed Referendums</div>
            <FaFolderMinus className="stats-card-icon" />
          </div>

          <div className="stats-card primary" style={{ position: 'relative' }}>
            <div className="stats-card-value">{stats?.totalVotes || 0}</div>
            <div className="stats-card-label">Total Votes Cast</div>
            <FaUsers className="stats-card-icon" />
          </div>
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 className="card-title">Quick Actions</h3>
          <div className="flex gap-2">
            <a href="/admin/referendums/create" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Create New Referendum
            </a>
            <a href="/admin/referendums" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Manage Referendums
            </a>
            <a href="/admin/results" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              View Results
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
