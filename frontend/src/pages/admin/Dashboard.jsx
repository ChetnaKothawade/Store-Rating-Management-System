import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { adminAPI } from '../../api/services';
import { getApiError } from '../../utils/helpers';
import AlertMessage from '../../components/AlertMessage';

function StatCard({ label, value, colorClass }) {
  return (
    <article className="col-md-4">
      <div className={`card border-0 shadow-sm h-100 border-start border-4 border-${colorClass}`}>
        <div className="card-body text-center py-4">
          <p className="text-muted mb-1 small text-uppercase">{label}</p>
          <p className={`display-5 fw-bold text-${colorClass} mb-0`}>{value ?? 0}</p>
        </div>
      </div>
    </article>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getDashboard()
      .then(({ data }) => setStats(data))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <p className="text-center py-5"><span className="spinner-border text-primary" /></p>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
      <AlertMessage message={error} />
      <section className="row g-4">
        <StatCard label="Total Users" value={stats?.totalUsers} colorClass="primary" />
        <StatCard label="Total Stores" value={stats?.totalStores} colorClass="success" />
        <StatCard label="Total Ratings" value={stats?.totalRatings} colorClass="warning" />
      </section>
    </Layout>
  );
}
