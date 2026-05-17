import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import AlertMessage from '../../components/AlertMessage';
import SortableHeader from '../../components/SortableHeader';
import StarRating from '../../components/StarRating';
import { storeAPI, ratingAPI } from '../../api/services';
import { validateRating } from '../../utils/validation';
import { getApiError, formatRating } from '../../utils/helpers';

export default function StoreListing() {
  const [stores, setStores] = useState([]);
  const [myRatings, setMyRatings] = useState({});
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalStore, setModalStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const loadStores = async () => {
    setLoading(true);
    try {
      const params = { sortBy, order };
      if (search.trim()) params.search = search.trim();
      const { data } = await storeAPI.getAll(params);
      setStores(data);
      const ratingsMap = {};
      await Promise.all(
        data.map(async (store) => {
          try {
            const res = await ratingAPI.getMyRating(store.id);
            if (res.data) ratingsMap[store.id] = res.data;
          } catch {
            /* no rating yet */
          }
        })
      );
      setMyRatings(ratingsMap);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, [sortBy, order]);

  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setOrder('ASC'); }
  };

  const openRatingModal = (store, existing) => {
    setModalStore(store);
    setRatingValue(existing?.rating || 0);
    setError('');
  };

  const closeModal = () => {
    setModalStore(null);
    setRatingValue(0);
  };

  const handleSubmitRating = async () => {
    const ratingErrors = validateRating(ratingValue);
    if (ratingErrors.length) {
      setError(ratingErrors.join('. '));
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const existing = myRatings[modalStore.id];
      if (existing) {
        await ratingAPI.update(existing.id, { rating: ratingValue });
        setSuccess('Rating updated successfully');
      } else {
        await ratingAPI.submit({ store_id: modalStore.id, rating: ratingValue });
        setSuccess('Rating submitted successfully');
      }
      closeModal();
      loadStores();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Browse Stores">
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />
      <AlertMessage message={error} onClose={() => setError('')} />

      <section className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <form
            onSubmit={(e) => { e.preventDefault(); loadStores(); }}
            className="row g-2 align-items-end"
          >
            <div className="col-md-8">
              <label className="form-label small">Search by store name or address</label>
              <input
                className="form-control"
                placeholder="Search stores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <button type="submit" className="btn btn-primary w-100">Search</button>
            </div>
          </form>
        </div>
      </section>

      <section className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <SortableHeader label="Store Name" field="name" sortBy={sortBy} order={order} onSort={handleSort} />
                <SortableHeader label="Address" field="address" sortBy={sortBy} order={order} onSort={handleSort} />
                <SortableHeader label="Overall Rating" field="avg_rating" sortBy={sortBy} order={order} onSort={handleSort} />
                <th>Your Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-4"><span className="spinner-border spinner-border-sm" /></td></tr>
              ) : stores.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted py-4">No stores found</td></tr>
              ) : (
                stores.map((store) => {
                  const myRating = myRatings[store.id];
                  return (
                    <tr key={store.id}>
                      <td className="fw-medium">{store.name}</td>
                      <td className="small">{store.address || '—'}</td>
                      <td>{formatRating(store.avg_rating)}</td>
                      <td>{myRating ? myRating.rating : '—'}</td>
                      <td>
                        <button
                          type="button"
                          className={`btn btn-sm ${myRating ? 'btn-outline-warning' : 'btn-outline-primary'}`}
                          onClick={() => openRatingModal(store, myRating)}
                        >
                          {myRating ? 'Modify Rating' : 'Submit Rating'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalStore && (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {myRatings[modalStore.id] ? 'Modify' : 'Submit'} Rating — {modalStore.name}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close" />
                </div>
                <div className="modal-body text-center">
                  <p className="text-muted small mb-3">Select a rating from 1 to 5</p>
                  <StarRating value={ratingValue} onChange={setRatingValue} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleSubmitRating} disabled={submitting || !ratingValue}>
                    {submitting ? 'Saving...' : 'Save Rating'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
