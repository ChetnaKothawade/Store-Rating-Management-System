import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleLabel } from '../utils/helpers';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/users">Users</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/stores">Stores</Link>
      </li>
    </>
  );

  const userLinks = (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/stores">Stores</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/profile">Profile</Link>
      </li>
    </>
  );

  const ownerLinks = (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/owner/dashboard">Dashboard</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/profile">Profile</Link>
      </li>
    </>
  );

  const roleLinks = {
    admin: adminLinks,
    user: userLinks,
    owner: ownerLinks,
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to={user ? (user.role === 'admin' ? '/admin/dashboard' : user.role === 'owner' ? '/owner/dashboard' : '/stores') : '/login'}>
          Store Rating
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && roleLinks[user.role]}
          </ul>
          {user && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-white-50 small d-none d-md-inline">
                {user.name} · {getRoleLabel(user.role)}
              </span>
              <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
