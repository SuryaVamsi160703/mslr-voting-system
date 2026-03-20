import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import VoterLogin from './pages/VoterLogin';
import VoterRegister from './pages/VoterRegister';
import AdminLogin from './pages/AdminLogin';
import VoterDashboard from './pages/VoterDashboard';
import VoterReferendums from './pages/VoterReferendums';
import VoterReferendumDetail from './pages/VoterReferendumDetail';
import VoterResults from './pages/VoterResults';
import VoterProfile from './pages/VoterProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminReferendums from './pages/AdminReferendums';
import AdminCreateReferendum from './pages/AdminCreateReferendum';
import AdminEditReferendum from './pages/AdminEditReferendum';
import AdminResults from './pages/AdminResults';
import AdminProfile from './pages/AdminProfile';

// Protected Route Components
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/voter/login" />;
  }

  if (adminOnly && user.role !== 'EC') {
    return <Navigate to="/voter/dashboard" />;
  }

  if (!adminOnly && user.role === 'EC') {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (user) {
    if (user.role === 'EC') {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/voter/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/voter/login" />} />
          
          {/* Voter Public Routes */}
          <Route
            path="/voter/login"
            element={
              <PublicRoute>
                <VoterLogin />
              </PublicRoute>
            }
          />
          <Route
            path="/voter/register"
            element={
              <PublicRoute>
                <VoterRegister />
              </PublicRoute>
            }
          />

          {/* Admin Public Routes */}
          <Route
            path="/admin/login"
            element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            }
          />

          {/* Voter Protected Routes */}
          <Route
            path="/voter/dashboard"
            element={
              <ProtectedRoute>
                <VoterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voter/referendums"
            element={
              <ProtectedRoute>
                <VoterReferendums />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voter/referendums/:id"
            element={
              <ProtectedRoute>
                <VoterReferendumDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voter/results"
            element={
              <ProtectedRoute>
                <VoterResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voter/profile"
            element={
              <ProtectedRoute>
                <VoterProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/referendums"
            element={
              <ProtectedRoute adminOnly>
                <AdminReferendums />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/referendums/create"
            element={
              <ProtectedRoute adminOnly>
                <AdminCreateReferendum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/referendums/:id/edit"
            element={
              <ProtectedRoute adminOnly>
                <AdminEditReferendum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/results"
            element={
              <ProtectedRoute adminOnly>
                <AdminResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute adminOnly>
                <AdminProfile />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
