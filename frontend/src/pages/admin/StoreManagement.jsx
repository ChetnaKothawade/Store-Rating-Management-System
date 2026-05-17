import { useEffect, useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import AlertMessage from '../../components/AlertMessage';
import SortableHeader from '../../components/SortableHeader';
import { adminAPI } from '../../api/services';
import { validateEmail, validateAddress } from '../../utils/validation';
import { getApiError, formatRating } from '../../utils/helpers';

const emptyStore = { name: '', email: '', address: '', owner_id: '' };

export default function StoreManagement() {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [filters, setFilters] = useState({ search: '', name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyStore);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = () => {
    setLoading(true);
    const params = { sortBy, order };
    if (filters.search) params.search = filters.search;
    adminAPI
      .getStores(params)
      .then(({ data }) => setStores(data))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  };

  const fetchOwners = () => {
    adminAPI.getUsers({ role: 'owner' }).then(({ data }) => setOwners(data));
  };

  useEffect(() => {
    fetchStores();
    fetchOwners();
  }, [sortBy, order]);

  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      if (filters.name && !s.name?.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.email && !s.email?.toLowerCase().includes(filters.email.toLowerCase())) return false;
      if (filters.address && !s.address?.toLowerCase().includes(filters.address.toLowerCase())) return false;
      return true;
    });
  }, [stores, filters.name, filters.email, filters.address]);

  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setOrder('ASC'); }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    const errors = [...validateEmail(form.email), ...validateAddress(form.address)];
    if (!form.name?.trim()) errors.push('Store name is required');
    if (errors.length) { setError(errors.join('. ')); return; }

    setSubmitting(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        email: form.email,
        address: form.address,
        owner_id: form.owner_id ? Number(form.owner_id) : null,
      };
      await adminAPI.addStore(payload);
      setSuccess('Store created successfully');
      setForm(emptyStore);
      setShowForm(false);
      fetchStores();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Store Management">
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />
      <AlertMessage message={error} onClose={() => setError('')} />

      <section className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h2 className="h6 mb-3">Filter Stores</h2>
          <form onSubmit={(e) => { e.preventDefault(); fetchStores(); }} className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label small">Search (name, address)</label>
              <input className="form-control form-control-sm" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Name</label>
              <input className="form-control form-control-sm" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Email</label>
              <input className="form-control form-control-sm" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Address</label>
              <input className="form-control form-control-sm" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary btn-sm w-100">Apply</button>
            </div>
          </form>
        </div>
      </section>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h6 mb-0">All Stores</h2>
        <button type="button" className="btn btn-success btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Store'}
        </button>
      </div>

      {showForm && (
        <section className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h2 className="h6 mb-3">Add New Store</h2>
            <form onSubmit={handleAddStore} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Store Name</label>
                <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Store Email</label>
                <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Store Address</label>
                <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Store Owner</label>
                <select className="form-select" value={form.owner_id} onChange={(e) => setForm({ ...form, owner_id: e.target.value })}>
                  <option value="">No owner</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Create Store'}
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
                <SortableHeader label="Store Name" field="name" sortBy={sortBy} order={order} onSort={handleSort} />
                <SortableHeader label="Email" field="email" sortBy={sortBy} order={order} onSort={handleSort} />
                <SortableHeader label="Address" field="address" sortBy={sortBy} order={order} onSort={handleSort} />
                <th>Owner</th>
                <th>Overall Rating</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-4"><span className="spinner-border spinner-border-sm" /></td></tr>
              ) : filteredStores.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted py-4">No stores found</td></tr>
              ) : (
                filteredStores.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td className="small">{s.address || '—'}</td>
                    <td>{s.owner_name || '—'}</td>
                    <td>{formatRating(s.avg_rating)}</td>
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
