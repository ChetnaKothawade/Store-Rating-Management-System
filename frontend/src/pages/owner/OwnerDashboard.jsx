import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import AlertMessage from '../../components/AlertMessage';
import { ratingAPI } from '../../api/services';
import { getApiError, formatRating } from '../../utils/helpers';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ratingAPI
      .getOwnerDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout title="Store Owner Dashboard">
        <p className="text-center py-5"><span className="spinner-border text-primary" /></p>
      </Layout>
    );
  }

  const store = data?.store;
  const ratings = data?.ratings || [];

  return (
    <Layout title="Store Owner Dashboard">
      <AlertMessage message={error} />

      {!store ? (
        <section className="alert alert-info">No store is assigned to your account yet. Contact an administrator.</section>
      ) : (
        <>
          <section className="row g-4 mb-4">
            <article className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Your Store</p>
                  <p className="h5 mb-0">{store.name}</p>
                  <p className="small text-muted mb-0">{store.address}</p>
                </div>
              </div>
            </article>
            <article className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <p className="text-muted small mb-1">Average Rating</p>
                  <p className="display-6 fw-bold text-warning mb-0">{formatRating(data?.avg_rating)}</p>
                </div>
              </div>
            </article>
            <article className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <p className="text-muted small mb-1">Total Ratings</p>
                  <p className="display-6 fw-bold text-primary mb-0">{ratings.length}</p>
                </div>
              </div>
            </article>
          </section>

          <section className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <h2 className="h6 mb-0">Ratings Overview</h2>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.length === 0 ? (
                    <tr><td colSpan={3} className="text-center text-muted py-4">No ratings yet</td></tr>
                  ) : (
                    ratings.map((r) => (
                      <tr key={r.id}>
                        <td>{r.user_name}</td>
                        <td>{r.user_email}</td>
                        <td>
                          <span className="badge bg-warning text-dark">{r.rating} / 5</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
}
