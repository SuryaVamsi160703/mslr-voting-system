import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { FaVoteYea, FaCheckCircle } from 'react-icons/fa';

function VoterReferendumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [referendum, setReferendum] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadReferendum();
    checkVoteStatus();
  }, [id]);

  const loadReferendum = async () => {
    try {
      const response = await axios.get(`/api/referendums/${id}`);
      setReferendum(response.data.referendum);
      setOptions(response.data.options);
    } catch (error) {
      console.error('Load referendum error:', error);
      setError('Failed to load referendum');
    } finally {
      setLoading(false);
    }
  };

  const checkVoteStatus = async () => {
    try {
      const response = await axios.get(`/api/referendums/${id}/my-vote`);
      setHasVoted(response.data.hasVoted);
      if (response.data.hasVoted) {
        setSelectedOption(response.data.vote.voted_option_id);
      }
    } catch (error) {
      console.error('Check vote status error:', error);
    }
  };

  const handleVote = async () => {
    if (!selectedOption) {
      setError('Please select an option');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await axios.post(`/api/referendums/${id}/vote`, { optionId: selectedOption });
      setSuccess('Your vote has been recorded successfully!');
      setHasVoted(true);
      setTimeout(() => {
        navigate('/voter/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cast vote');
    } finally {
      setSubmitting(false);
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

  if (!referendum) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="empty-state">
          <h3>Referendum Not Found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--dark-green)', marginBottom: '1rem' }}>
            Referendum #{referendum.referendum_id}
          </h1>

          {referendum.status === 'open' ? (
            <span className="badge badge-open">Open for Voting</span>
          ) : (
            <span className="badge badge-closed">Closed</span>
          )}

          <p style={{ fontSize: '1.1rem', color: 'var(--grey)', marginTop: '1.5rem', lineHeight: 1.8 }}>
            {referendum.text}
          </p>

          {error && (
            <div className="alert alert-error" style={{ marginTop: '1.5rem' }}>
              <span>❌</span>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{ marginTop: '1.5rem' }}>
              <span>✅</span>
              {success}
            </div>
          )}

          {hasVoted ? (
            <div className="alert alert-info" style={{ marginTop: '2rem' }}>
              <FaCheckCircle />
              <div>
                <strong>You have already voted in this referendum</strong>
                <p>Your vote has been recorded and cannot be changed.</p>
              </div>
            </div>
          ) : referendum.status === 'closed' ? (
            <div className="alert alert-warning" style={{ marginTop: '2rem' }}>
              <span>⚠️</span>
              This referendum is closed and no longer accepting votes.
            </div>
          ) : (
            <>
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: 'var(--dark-green)', marginBottom: '1rem' }}>Select Your Option:</h3>
                <div className="referendum-options">
                  {options.map((option) => (
                    <div
                      key={option.opt_id}
                      className={`option-item ${selectedOption === option.opt_id ? 'selected' : ''}`}
                      onClick={() => setSelectedOption(option.opt_id)}
                    >
                      <input
                        type="radio"
                        name="option"
                        value={option.opt_id}
                        checked={selectedOption === option.opt_id}
                        onChange={() => setSelectedOption(option.opt_id)}
                      />
                      <span className="option-text">{option.option_text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button
                  onClick={handleVote}
                  className="btn btn-primary"
                  disabled={submitting || !selectedOption}
                  style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
                >
                  <FaVoteYea style={{ marginRight: '0.5rem' }} />
                  {submitting ? 'Submitting...' : 'Cast Your Vote'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoterReferendumDetail;
