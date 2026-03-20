import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaVoteYea, FaEnvelope, FaLock, FaUserShield, FaUser, FaClock } from 'react-icons/fa';

function VoterLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUser, setLastUser] = useState(null);

  useEffect(() => {
    // Load last logged in user info
    const lastEmail = localStorage.getItem('lastEmail');
    const lastUserName = localStorage.getItem('lastUserName');
    const lastLoginTime = localStorage.getItem('lastLoginTime');
    
    if (lastEmail && lastEmail !== 'ec@referendum.gov.sr') {
      setEmail(lastEmail);
      
      if (lastUserName && lastLoginTime) {
        setLastUser({
          name: lastUserName,
          email: lastEmail,
          time: lastLoginTime
        });
      }
    }
  }, []);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const clearSavedEmail = () => {
    localStorage.removeItem('lastEmail');
    localStorage.removeItem('lastUserName');
    localStorage.removeItem('lastLoginTime');
    setEmail('');
    setLastUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      if (result.user.role === 'VOTER') {
        navigate('/voter/dashboard');
      } else {
        setError('Please use the admin login page');
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="split-layout">
      <div className="split-left">
        <div className="branding">
          <div className="branding-icon">
            <FaVoteYea />
          </div>
          <h1>My Shangri-La Referendum</h1>
          <p>
            Your voice matters. Participate in shaping the future of Shangri-La
            through secure and transparent democratic voting.
          </p>
        </div>
      </div>

      <div className="split-right">
        <div className="form-container">
          <div className="form-header">
            <h2>Voter Login</h2>
            <p>Sign in to cast your vote</p>
          </div>

          {/* Last Login Info */}
          {lastUser && (
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FaUser style={{ fontSize: '1.2rem' }} />
                <strong style={{ fontSize: '1.1rem' }}>Welcome back, {lastUser.name}!</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
                <FaClock />
                <span>Last login: {getTimeAgo(lastUser.time)}</span>
              </div>
              <div style={{ 
                fontSize: '0.85rem', 
                marginTop: '0.5rem', 
                opacity: 0.8,
                fontStyle: 'italic'
              }}>
                {lastUser.email}
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span>❌</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope style={{ display: 'inline', marginRight: '0.5rem' }} />
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
                {email && (
                  <button
                    type="button"
                    onClick={clearSavedEmail}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--grey)',
                      fontSize: '0.9rem',
                      padding: '5px'
                    }}
                    title="Clear saved email"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FaLock style={{ display: 'inline', marginRight: '0.5rem' }} />
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--grey)' }}>
              Don't have an account?{' '}
              <Link
                to="/voter/register"
                style={{ color: 'var(--dark-green)', fontWeight: 600 }}
              >
                Register here
              </Link>
            </p>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB' }}>
            <Link
              to="/admin/login"
              style={{
                color: 'var(--olive)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              <FaUserShield />
              Election Commission Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoterLogin;
