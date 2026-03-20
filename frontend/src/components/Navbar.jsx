import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaVoteYea, FaHome, FaList, FaTachometerAlt, FaChartBar, FaUser, FaSignOutAlt } from 'react-icons/fa';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(isAdmin() ? '/admin/login' : '/voter/login');
  };

  const baseRoute = isAdmin() ? '/admin' : '/voter';

  const navLinks = isAdmin()
    ? [
        { path: `${baseRoute}/dashboard`, label: 'Dashboard', icon: <FaTachometerAlt /> },
        { path: `${baseRoute}/referendums`, label: 'Referendums', icon: <FaList /> },
        { path: `${baseRoute}/results`, label: 'Results', icon: <FaChartBar /> },
        { path: `${baseRoute}/profile`, label: 'About Me', icon: <FaUser /> }
      ]
    : [
        { path: `${baseRoute}/dashboard`, label: 'Home', icon: <FaHome /> },
        { path: `${baseRoute}/referendums`, label: 'Referendums', icon: <FaList /> },
        { path: `${baseRoute}/results`, label: 'Results', icon: <FaChartBar /> },
        { path: `${baseRoute}/profile`, label: 'About Me', icon: <FaUser /> }
      ];

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to={`${baseRoute}/dashboard`} className="navbar-brand">
          <FaVoteYea className="navbar-brand-icon" />
          <span>MSLR</span>
        </Link>

        <ul className="navbar-menu">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-user">
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{isAdmin() ? 'Election Commission' : 'Voter'}</div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
