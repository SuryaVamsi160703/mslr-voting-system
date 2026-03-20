import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { FaCheckCircle, FaClock, FaTimesCircle, FaVoteYea } from 'react-icons/fa';

function VoterDashboard() {
  const [referendums, setReferendums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferendums();
  }, []);

  const loadReferendums = async () => {
    try {
      const response = await axios.get('/api/referendums/with-vote/list');
      setReferendums(response.data.referendums);
    } catch (error) {
      console.error('Load referendums error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (referendum) => {
    if (referendum.has_voted) {
      return <span className="badge badge-voted"><FaCheckCircle /> Voted</span>;
    } else if (referendum.status === 'open') {
      return <span className="badge badge-open"><FaClock /> Open</span>;
    } else {
      return <span className="badge badge-closed"><FaTimesCircle /> Closed</span>;
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
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--dark-green)', marginBottom: '0.5rem' }}>
            <FaVoteYea style={{ marginRight: '0.75rem' }} />
            Welcome to Your Voting Dashboard
          </h1>
          <p style={{ color: 'var(--grey)', fontSize: '1.1rem' }}>
            View and participate in active referendums
          </p>
        </div>

        {referendums.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🗳️</div>
            <h3>No Referendums Available</h3>
            <p>Check back later for new referendums</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {referendums.map((referendum) => (
              <div key={referendum.referendum_id} className="card">
                <div className="flex-between mb-2">
                  <h3 className="card-title" style={{ fontSize: '1.25rem', margin: 0 }}>
                    Referendum #{referendum.referendum_id}
                  </h3>
                  {getStatusBadge(referendum)}
                </div>
                <p style={{ color: 'var(--grey)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  {referendum.text}
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/voter/referendums/${referendum.referendum_id}`}
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    {referendum.has_voted ? 'View Details' : 'Vote Now'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VoterDashboard;
