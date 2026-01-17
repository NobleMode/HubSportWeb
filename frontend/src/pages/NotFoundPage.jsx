import { Link } from 'react-router-dom';

/**
 * 404 Not Found Page
 */
const NotFoundPage = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn-primary">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
