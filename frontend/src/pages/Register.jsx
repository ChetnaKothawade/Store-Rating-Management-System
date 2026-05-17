import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateUserForm } from '../utils/validation';
import { getApiError } from '../utils/helpers';
import AlertMessage from '../components/AlertMessage';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateUserForm(form);
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    setError('');
    setLoading(true);
    try {
      await register(form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      variant="register"
      title="Join us"
      subtitle="Create your account and start rating stores"
      icon="✦"
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <AlertMessage type="success" message={success} />
      <AlertMessage
        message={error || (errors.length ? errors.join('. ') : '')}
        onClose={() => { setError(''); setErrors([]); }}
      />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name (20–60 characters)</label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address (max 400 characters)</label>
          <textarea
            name="address"
            className="form-control"
            rows={2}
            placeholder="Your address"
            value={form.address}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Password (8–16 chars, uppercase & special)</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-auth w-100" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
}
