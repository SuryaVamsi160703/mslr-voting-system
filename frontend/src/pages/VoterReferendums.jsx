import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { FaList, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

function VoterReferendums() {
  const [referendums, setReferendums] = useState([]);
  const [filter, setFilter] = useState('all');
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

  const filteredReferendums = referendums.filter((ref) => {
    if (filter === 'open') return ref.status === 'open' && !ref.has_voted;
    if (filter === 'closed') return ref.status === 'closed';
    if (filter === 'voted') return ref.has_voted;
    return true;
  });

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
          <h1 style={{ fontSize: '2rem', color: 'var(--dark-green)', marginBottom: '1rem' }}>
            <FaList style={{ marginRight: '0.75rem' }} />
            All Referendums
          </h1>
          
          <div className="flex gap-2">
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`btn ${filter === 'open' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('open')}
            >
              Open
            </button>
            <button
              className={`btn ${filter === 'voted' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('voted')}
            >
              Voted
            </button>
            <button
              className={`btn ${filter === 'closed' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('closed')}
            >
              Closed
            </button>
          </div>
        </div>

        {filteredReferendums.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🗳️</div>
            <h3>No Referendums Found</h3>
            <p>No referendums match your filter</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {filteredReferendums.map((referendum) => (
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
                <Link
                  to={`/voter/referendums/${referendum.referendum_id}`}
                  className="btn btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  {referendum.has_voted ? 'View Details' : 'Vote Now'}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VoterReferendums;
