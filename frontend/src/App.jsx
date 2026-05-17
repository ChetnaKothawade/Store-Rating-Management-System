import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute, { PublicOnlyRoute } from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import ProfileSettings from './pages/ProfileSettings';

import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import UserDetails from './pages/admin/UserDetails';
import StoreManagement from './pages/admin/StoreManagement';

import StoreListing from './pages/user/StoreListing';
import OwnerDashboard from './pages/owner/OwnerDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute allowedRoles={['admin']}><UserManagement /></PrivateRoute>} />
          <Route path="/admin/users/:id" element={<PrivateRoute allowedRoles={['admin']}><UserDetails /></PrivateRoute>} />
          <Route path="/admin/stores" element={<PrivateRoute allowedRoles={['admin']}><StoreManagement /></PrivateRoute>} />

          <Route path="/stores" element={<PrivateRoute allowedRoles={['user']}><StoreListing /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute allowedRoles={['user', 'owner']}><ProfileSettings /></PrivateRoute>} />

          <Route path="/owner/dashboard" element={<PrivateRoute allowedRoles={['owner']}><OwnerDashboard /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
