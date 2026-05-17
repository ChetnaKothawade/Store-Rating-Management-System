import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import AlertMessage from '../../components/AlertMessage';
import { adminAPI } from '../../api/services';
import { getApiError, getRoleLabel, formatRating } from '../../utils/helpers';

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getUserById(id)
      .then(({ data }) => setUser(data))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout title="User Details">
        <p className="text-center py-5"><span className="spinner-border text-primary" /></p>
      </Layout>
    );
  }

  if (!user && error) {
    return (
      <Layout title="User Details">
        <AlertMessage message={error} />
        <Link to="/admin/users" className="btn btn-link">← Back to Users</Link>
      </Layout>
    );
  }

  return (
    <Layout title="User Details">
      <Link to="/admin/users" className="btn btn-outline-secondary btn-sm mb-3">← Back to Users</Link>
      <AlertMessage message={error} />
      <section className="card shadow-sm border-0">
        <div className="card-body">
          <dl className="row mb-0">
            <dt className="col-sm-3">Name</dt>
            <dd className="col-sm-9">{user?.name}</dd>
            <dt className="col-sm-3">Email</dt>
            <dd className="col-sm-9">{user?.email}</dd>
            <dt className="col-sm-3">Address</dt>
            <dd className="col-sm-9">{user?.address || '—'}</dd>
            <dt className="col-sm-3">Role</dt>
            <dd className="col-sm-9">{getRoleLabel(user?.role)}</dd>
            {user?.role === 'owner' && (
              <>
                <dt className="col-sm-3">Store Name</dt>
                <dd className="col-sm-9">{user?.store_name || '—'}</dd>
                <dt className="col-sm-3">Average Store Rating</dt>
                <dd className="col-sm-9">{formatRating(user?.store_rating)}</dd>
              </>
            )}
          </dl>
        </div>
      </section>
    </Layout>
  );
}
