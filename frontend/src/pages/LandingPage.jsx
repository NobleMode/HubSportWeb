import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../features/auth/authSlice";

const LandingPage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-6 py-20 lg:py-32 flex flex-col-reverse lg:flex-row items-center">
          <div className="lg:w-1/2">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
              ELEVATE{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electricBlue to-limeGreen">
                YOUR GAME
              </span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-lg">
              Premium sports equipment rental and professional coaching. Unlock
              your peak performance with SportHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="px-8 py-4 bg-electricBlue hover:bg-electricBlue-hover text-white font-bold rounded-full transition transform hover:scale-105 shadow-lg text-center"
              >
                Start renting
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="px-8 py-4 border-2 border-limeGreen text-limeGreen hover:bg-limeGreen hover:text-white font-bold rounded-full transition text-center"
                >
                  My Profile
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="px-8 py-4 border-2 border-limeGreen text-limeGreen hover:bg-limeGreen hover:text-white font-bold rounded-full transition text-center"
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
          <div className="lg:w-1/2 mb-12 lg:mb-0 relative">
            {/* Abstract energetic shapes background */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-lime-100 rounded-full blur-3xl opacity-50"></div>

            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Athlete working out"
              className="relative z-10 w-full h-auto rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500 ease-out object-cover grayscale hover:grayscale-0"
            />
          </div>
        </div>
      </section>

      {/* Equipment Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pro-Grade Gear</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Top-tier equipment for every athlete. Rent what you need, when you
              need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300 group">
              <div className="h-48 bg-gray-100 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1626224583726-e2c774870364?w=500&auto=format&fit=crop&q=60"
                  alt="Badminton"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-4 right-4 bg-limeGreen text-white text-xs font-bold px-3 py-1 rounded-full">
                  NEW
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Yonex Astrox 77</h3>
              <p className="text-gray-400 mb-6 text-sm">
                Badminton • Professional
              </p>
              <div className="flex justify-between items-center">
                <span className="text-electricBlue font-bold text-lg">
                  $15/day
                </span>
                <Link
                  to="/products/1"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 hover:bg-electricBlue hover:text-white transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300 group">
              <div className="h-48 bg-gray-100 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1617083934555-ac7d4fee8909?w=500&auto=format&fit=crop&q=60"
                  alt="Tennis"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Wilson Pro Staff</h3>
              <p className="text-gray-400 mb-6 text-sm">Tennis • Elite</p>
              <div className="flex justify-between items-center">
                <span className="text-electricBlue font-bold text-lg">
                  $25/day
                </span>
                <Link
                  to="/products/2"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 hover:bg-electricBlue hover:text-white transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300 group">
              <div className="h-48 bg-gray-100 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500&auto=format&fit=crop&q=60"
                  alt="Soccer"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Adidas Al Rihla</h3>
              <p className="text-gray-400 mb-6 text-sm">
                Soccer • Official Match Ball
              </p>
              <div className="flex justify-between items-center">
                <span className="text-electricBlue font-bold text-lg">
                  $10/day
                </span>
                <Link
                  to="/products/3"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 hover:bg-electricBlue hover:text-white transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Tracking Demo Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-10 rounded-full"></div>
            {/* Glassmorphism Dashboard Card */}
            <div className="relative bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Weekly Activity
                  </h3>
                  <span className="text-sm text-gray-400">May 2024</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">
                  +12%
                </span>
              </div>

              {/* Mock Chart */}
              <div className="h-48 flex items-end justify-between gap-2 mb-6">
                {[40, 70, 45, 90, 65, 85, 55].map((h, i) => (
                  <div
                    key={i}
                    className="w-full bg-gray-100 rounded-t-lg relative group overflow-hidden"
                  >
                    <div
                      className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-electricBlue to-blue-400 rounded-t-lg transition-all duration-1000 group-hover:opacity-80"
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  <div className="text-gray-400 text-xs mb-1">
                    Calories Burned
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    2,450{" "}
                    <span className="text-fire-500 text-orange-500 text-sm">
                      🔥
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  <div className="text-gray-400 text-xs mb-1">Active Hours</div>
                  <div className="text-2xl font-bold text-gray-800">
                    18.5 <span className="text-limeGreen text-sm">⚡</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold mb-6">
              Track Your Progress. <br />
              Visualize Your Gains.
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Stay on top of your game with our advanced analytics dashboard.
              Monitor bookings, rental history, and performance stats all in one
              place.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Real-time updates",
                "Detailed performance metrics",
                "Goal setting and tracking",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-lime-100 flex items-center justify-center text-limeGreen">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Expert Profiles Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Train with the Best</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get coached by certified professionals to reach your fitness
              goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Coach David",
                role: "Tennis Pro",
                img: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=500&auto=format&fit=crop&q=60",
              },
              {
                name: "Sarah Lee",
                role: "Yoga Expert",
                img: "https://images.unsplash.com/photo-1518550687729-819219298d98?w=500&auto=format&fit=crop&q=60",
              },
              {
                name: "Mike Chen",
                role: "Strength Coach",
                img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop&q=60",
              },
              {
                name: "Elena R.",
                role: "Cardio Specialist",
                img: "https://images.unsplash.com/photo-1610419266155-25e143c49021?w=500&auto=format&fit=crop&q=60",
              },
            ].map((expert, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-2xl p-6 text-center hover:-translate-y-2 transition duration-300 border border-gray-700 hover:border-electricBlue"
              >
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-electricBlue p-1">
                  <img
                    src={expert.img}
                    alt={expert.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-bold">{expert.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{expert.role}</p>
                <div className="flex justify-center gap-1 mb-6 text-yellow-400">
                  {"★★★★★".split("").map((c, idx) => (
                    <span key={idx}>{c}</span>
                  ))}
                </div>
                <Link
                  to="/players"
                  className="block w-full py-2 rounded-lg bg-gray-700 hover:bg-electricBlue text-white transition font-medium text-sm"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-3xl p-12 lg:p-20 text-center text-white relative overflow-hidden">
            {/* Decor circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-limeGreen opacity-20 rounded-full -ml-32 -mb-32 filter blur-3xl"></div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 relative z-10">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto relative z-10">
              Join SportHub Premium today. Get exclusive access to elite
              equipment, priority booking, and advanced analytics.
            </p>
            {isAuthenticated ? (
              <Link
                to="/products"
                className="inline-block px-10 py-5 bg-limeGreen text-black font-extrabold rounded-full text-lg hover:bg-limeGreen-hover hover:scale-105 transition shadow-[0_0_20px_rgba(132,204,22,0.6)] relative z-10"
              >
                BROWSE PREMIUM GEAR
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-block px-10 py-5 bg-limeGreen text-black font-extrabold rounded-full text-lg hover:bg-limeGreen-hover hover:scale-105 transition shadow-[0_0_20px_rgba(132,204,22,0.6)] relative z-10"
              >
                GET STARTED TODAY
              </Link>
            )}
            <p className="mt-6 text-sm text-blue-200 uppercase tracking-widest relative z-10">
              No commitment • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-gray-900 text-xl">SportHub</span>
            <span className="ml-2 text-sm">© 2024</span>
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-electricBlue">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-electricBlue">
              Terms of Service
            </a>
            <a href="#" className="hover:text-electricBlue">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
