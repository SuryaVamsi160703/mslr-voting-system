import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FaUserShield, FaEnvelope, FaIdCard } from 'react-icons/fa';

function AdminProfile() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--dark-green)', marginBottom: '2rem' }}>
            <FaUserShield style={{ marginRight: '0.75rem' }} />
            Admin Profile
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--grey)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <FaEnvelope />
                Email Address
              </label>
              <div style={{ padding: '0.875rem', background: 'var(--light-grey)', borderRadius: '8px', fontSize: '1.1rem' }}>
                {user?.email}
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--grey)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <FaUserShield />
                Name
              </label>
              <div style={{ padding: '0.875rem', background: 'var(--light-grey)', borderRadius: '8px', fontSize: '1.1rem' }}>
                {user?.name}
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--grey)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <FaIdCard />
                Role
              </label>
              <div style={{ padding: '0.875rem', background: 'var(--light-grey)', borderRadius: '8px', fontSize: '1.1rem' }}>
                Election Commission Administrator
              </div>
            </div>

            <div className="alert alert-info" style={{ marginTop: '1rem' }}>
              <span>ℹ️</span>
              <div>
                <strong>Administrator Privileges</strong>
                <p>You have full access to create, edit, and manage all referendums.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
