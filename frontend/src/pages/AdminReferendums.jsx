import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { FaList, FaPlus, FaEdit, FaFolderOpen, FaFolderMinus } from 'react-icons/fa';

function AdminReferendums() {
  const [referendums, setReferendums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadReferendums();
  }, []);

  const loadReferendums = async () => {
    try {
      const response = await axios.get('/api/admin/referendums');
      setReferendums(response.data.referendums);
    } catch (error) {
      console.error('Load referendums error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenClose = async (id, action) => {
    setActionLoading(id);
    try {
      await axios.patch(`/api/admin/referendums/${id}/${action}`);
      loadReferendums();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update referendum');
    } finally {
      setActionLoading(null);
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
        <div className="flex-between mb-3">
          <h1 style={{ fontSize: '2rem', color: 'var(--dark-green)' }}>
            <FaList style={{ marginRight: '0.75rem' }} />
            Manage Referendums
          </h1>
          <Link to="/admin/referendums/create" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <FaPlus /> Create New
          </Link>
        </div>

        {referendums.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🗳️</div>
            <h3>No Referendums Yet</h3>
            <p>Create your first referendum to get started</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {referendums.map((referendum) => (
              <div key={referendum.referendum_id} className="card">
                <div className="flex-between mb-2">
                  <h3 className="card-title" style={{ fontSize: '1.25rem', margin: 0 }}>
                    Referendum #{referendum.referendum_id}
                  </h3>
                  {referendum.status === 'open' ? (
                    <span className="badge badge-open">Open</span>
                  ) : (
                    <span className="badge badge-closed">Closed</span>
                  )}
                </div>
                <p style={{ color: 'var(--grey)', marginBottom: '1rem' }}>
                  {referendum.text}
                </p>
                <p style={{ color: 'var(--olive)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  <strong>{referendum.total_votes}</strong> votes received
                </p>
                <div className="flex gap-2">
                  {referendum.total_votes === 0 && (
                    <Link
                      to={`/admin/referendums/${referendum.referendum_id}/edit`}
                      className="btn btn-secondary"
                      style={{ textDecoration: 'none' }}
                    >
                      <FaEdit /> Edit
                    </Link>
                  )}
                  {referendum.status === 'closed' ? (
                    <button
                      onClick={() => handleOpenClose(referendum.referendum_id, 'open')}
                      className="btn btn-success"
                      disabled={actionLoading === referendum.referendum_id}
                    >
                      <FaFolderOpen /> Open
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenClose(referendum.referendum_id, 'close')}
                      className="btn btn-danger"
                      disabled={actionLoading === referendum.referendum_id}
                    >
                      <FaFolderMinus /> Close
                    </button>
                  )}
                  <Link
                    to="/admin/results"
                    className="btn btn-outline"
                    style={{ textDecoration: 'none' }}
                  >
                    View Results
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

export default AdminReferendums;
