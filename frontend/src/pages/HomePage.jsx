import { Link } from 'react-router-dom';

/**
 * Home Page
 */
const HomePage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-12 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to SportHub Vietnam
        </h1>
        <p className="text-xl mb-8">
          Your one-stop destination for sports equipment sales and rentals
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/products" className="bg-white text-primary-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
            Browse Products
          </Link>
          <Link to="/register" className="bg-primary-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-800 transition-colors border-2 border-white">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card text-center">
          <div className="text-4xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold mb-2">Buy Equipment</h3>
          <p className="text-gray-600">
            Purchase high-quality sports equipment at competitive prices
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">🏃</div>
          <h3 className="text-xl font-semibold mb-2">Rent Equipment</h3>
          <p className="text-gray-600">
            Rent equipment for short-term use with flexible pricing
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">👨‍🏫</div>
          <h3 className="text-xl font-semibold mb-2">Book Experts</h3>
          <p className="text-gray-600">
            Connect with sports experts for training and guidance
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6">
          Join SportHub Vietnam today and explore our wide range of products and services
        </p>
        <Link to="/register" className="btn-primary">
          Create an Account
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
