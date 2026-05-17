import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import AlertMessage from '../../components/AlertMessage';
import SortableHeader from '../../components/SortableHeader';
import { adminAPI } from '../../api/services';
import { validateUserForm } from '../../utils/validation';
import { getApiError, getRoleLabel, formatRating } from '../../utils/helpers';

const emptyUser = { name: '', email: '', address: '', password: '', role: 'user' };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ search: '', role: '', name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyUser);
  const [formErrors, setFormErrors] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    const params = { sortBy, order };
    if (filters.search) params.search = filters.search;
    if (filters.role) params.role = filters.role;
    adminAPI
      .getUsers(params)
      .then(({ data }) => setUsers(data))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [sortBy, order]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filters.name && !u.name?.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.email && !u.email?.toLowerCase().includes(filters.email.toLowerCase())) return false;
      if (filters.address && !u.address?.toLowerCase().includes(filters.address.toLowerCase())) return false;
      return true;
    });
  }, [users, filters.name, filters.email, filters.address]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setOrder('ASC');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const validationErrors = validateUserForm(form);
    if (!form.role) validationErrors.push('Role is required');
    if (validationErrors.length) {
      setFormErrors(validationErrors);
      return;
    }
    setFormErrors([]);
    setSubmitting(true);
    try {
      await adminAPI.addUser(form);
      setSuccess('User created successfully');
      setForm(emptyUser);
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="User Management">
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />
      <AlertMessage message={error} onClose={() => setError('')} />

      <section className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h2 className="h6 mb-3">Filter Users</h2>
          <form onSubmit={handleSearch} className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label small">Search (name, email, address)</label>
              <input className="form-control form-control-sm" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Role</label>
              <select className="form-select form-select-sm" value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
                <option value="">All</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small">Name</label>
              <input className="form-control form-control-sm" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Email</label>
              <input className="form-control form-control-sm" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Address</label>
              <input className="form-control form-control-sm" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
            </div>
            <div className="col-md-1">
              <button type="submit" className="btn btn-primary btn-sm w-100">Apply</button>
            </div>
          </form>
        </div>
      </section>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h6 mb-0">All Users</h2>
        <button type="button" className="btn btn-success btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {showForm && (
        <section className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h2 className="h6 mb-3">Add New User</h2>
            {formErrors.length > 0 && <AlertMessage message={formErrors.join('. ')} />}
            <form onSubmit={handleAddUser} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Address</label>
                <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Role</label>
                <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="user">Normal User</option>
                  <option value="owner">Store Owner</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      <section className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <SortableHeader label="Name" field="name" sortBy={sortBy} order={order} onSort={handleSort} />
                <SortableHeader label="Email" field="email" sortBy={sortBy} order={order} onSort={handleSort} />
                <th>Address</th>
                <SortableHeader label="Role" field="role" sortBy={sortBy} order={order} onSort={handleSort} />
                <th>Store Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-4"><span className="spinner-border spinner-border-sm" /></td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted py-4">No users found</td></tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td className="small">{u.address || '—'}</td>
                    <td><span className="badge bg-secondary">{getRoleLabel(u.role)}</span></td>
                    <td>{u.role === 'owner' ? formatRating(u.store_rating) : '—'}</td>
                    <td>
                      <Link to={`/admin/users/${u.id}`} className="btn btn-outline-primary btn-sm">Details</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
