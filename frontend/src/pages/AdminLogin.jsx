import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserShield, FaEnvelope, FaLock, FaVoteYea } from 'react-icons/fa';

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Don't pre-fill email for security

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      if (result.user.role === 'EC') {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials');
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
            <FaUserShield />
          </div>
          <h1>Election Commission</h1>
          <p>
            Administrative access to manage referendums, monitor voting progress,
            and ensure democratic transparency in Shangri-La.
          </p>
          <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
            <p><strong>Default Credentials:</strong></p>
            <p>Email: ec@referendum.gov.sr</p>
            <p>Password: Request Ec for Password</p>
            {/* <p>Email: ec@referendum.gov.sr</p>
            <p>Password: Shangrilavote&2025@</p> */}
          </div>
        </div>
      </div>

      <div className="split-right">
        <div className="form-container">
          <div className="form-header">
            <h2>Admin Login</h2>
            <p>Election Commission Access</p>
          </div>

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
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@referendum.gov.sr"
                required
              />
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
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB' }}>
            <Link
              to="/voter/login"
              style={{
                color: 'var(--olive)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              <FaVoteYea />
              Voter Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
