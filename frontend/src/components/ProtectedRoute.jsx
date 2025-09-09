import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = localStorage.getItem('userType');
  const accessToken = localStorage.getItem('accessToken');

  if (!isAuthenticated || !accessToken || !userType) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function StudentProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = localStorage.getItem('userType');
  const accessToken = localStorage.getItem('accessToken');

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (userType !== 'student') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = localStorage.getItem('userType');
  const accessToken = localStorage.getItem('accessToken');

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (userType !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
export { StudentProtectedRoute, AdminProtectedRoute };
