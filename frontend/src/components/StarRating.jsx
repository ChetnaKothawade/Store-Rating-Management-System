export default function StarRating({ value, onChange, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="d-flex gap-1 align-items-center">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={`btn btn-link p-0 text-decoration-none ${star <= value ? 'text-warning' : 'text-muted'}`}
          style={{ fontSize: '1.25rem', lineHeight: 1 }}
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
