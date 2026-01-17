import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../services/userApi';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const { useGetUserByIdQuery } = userApi;

/**
 * Player Details Page
 * Displays detailed information about a player with full-width layout
 */
const PlayerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetUserByIdQuery(id);

  const player = data?.data;

  // Mock Reviews
  const reviews = [
    { id: 1, user: 'Nguyen Van A', rating: 5, comment: 'Great player, very friendly!', date: '2023-12-01' },
    { id: 2, user: 'Tran Thi B', rating: 4, comment: 'Good skills, fun to play with.', date: '2023-11-20' },
    { id: 3, user: 'Le Van C', rating: 5, comment: 'Highly recommended for doubles.', date: '2023-10-15' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 inline-block">
          Error loading player: {error.message || 'Player not found'}
        </div>
        <br />
        <Button onClick={() => navigate('/players')} variant="outline">Back to Players</Button>
      </div>
    );
  }

  if (!player) return null;

  // Parse Address to get City
  const getCity = (address) => {
    if (!address) return 'Unknown City';
    const parts = address.split(',');
    return parts[parts.length - 1]?.trim() || address;
  };

  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Header Banner */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Button onClick={() => navigate('/players')} variant="ghost" className="mb-4 pl-0 text-gray-500 hover:text-gray-900">
            &larr; Back to List
          </Button> 
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-4xl font-bold uppercase shadow-inner flex-shrink-0">
               {player.name ? player.name.charAt(0) : player.email.charAt(0)}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{player.name || 'Unnamed Player'}</h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    player.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                    player.role === 'EXPERT' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {player.role}
                 </span>
                 <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                   Joined {new Date(player.createdAt).toLocaleDateString()}
                 </span>
              </div>
              <div className="flex gap-4 justify-center md:justify-start">
                <Button onClick={() => alert('Feature coming soon!')}>Contact Player</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Contact Info */}
        <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Contact Info</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Email</label>
                        <p className="text-gray-900 break-words">{player.email}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Phone</label>
                        <p className="text-gray-900">{player.phone || 'Not provided'}</p>
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">City</label>
                        <p className="text-gray-900">{getCity(player.address)}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Availability</label>
                        <p className="text-green-600 font-medium">Available for matches</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Reviews & Stats */}
         <div className="md:col-span-2 space-y-6">
             {/* Stats Placeholder */}
             <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center">
                    <span className="block text-2xl font-bold text-primary-600">12</span>
                    <span className="text-sm text-gray-500">Matches Played</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center">
                    <span className="block text-2xl font-bold text-green-600">8</span>
                    <span className="text-sm text-gray-500">Won</span>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center">
                    <span className="block text-2xl font-bold text-yellow-500">4.8</span>
                    <span className="text-sm text-gray-500">Rating</span>
                </div>
             </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Player Reviews ({reviews.length})</h3>
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                                        {review.user.charAt(0)}
                                    </div>
                                    <span className="font-semibold text-gray-900">{review.user}</span>
                                </div>
                                <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailsPage;
