import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Unauthorized() {
  return (
    <Layout>
      <div className="text-center py-5">
        <h1 className="display-4 text-danger">403</h1>
        <p className="lead">You do not have permission to access this page.</p>
        <Link to="/login" className="btn btn-primary">Go to Login</Link>
      </div>
    </Layout>
  );
}
