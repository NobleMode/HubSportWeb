import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../services/userApi';
import { useCreateBookingMutation } from '../services/bookingApi';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';

const { useGetUserByIdQuery } = userApi;

/**
 * Player Details Page
 * Displays detailed information about a player with full-width layout
 */
const PlayerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetUserByIdQuery(id);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const player = data?.data;

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    bookingDate: '',
    duration: 1,
    notes: '',
  });
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage('');
    setBookingError('');
    try {
      await createBooking({
        expertId: player.expertProfile.id,
        bookingDate: bookingForm.bookingDate,
        duration: parseInt(bookingForm.duration, 10),
        notes: bookingForm.notes,
      }).unwrap();
      
      setBookingMessage('Booking successful! Payment deducted from your wallet.');
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err) {
      setBookingError(err.data?.message || 'Failed to book player');
    }
  };

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
              <div className="flex gap-4 justify-center md:justify-start mt-2">
                <Button onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                    return;
                  }
                  window.location.href = `mailto:${player.email}?subject=Inquiry from SportHub`;
                }} variant="outline">
                  Contact
                </Button>
                
                {player.expertProfile?.isAvailable && (
                  <Button onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                      return;
                    }
                    setIsModalOpen(true);
                  }}>
                    Book Player
                  </Button>
                )}
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
                        {player.expertProfile?.isAvailable ? (
                          <p className="text-green-600 font-medium overflow-hidden text-ellipsis whitespace-nowrap">Available for matches</p>
                        ) : (
                          <p className="text-red-500 font-medium overflow-hidden text-ellipsis whitespace-nowrap">Currently unavailable</p>
                        )}
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

      {/* Booking Modal */}
      {isModalOpen && player?.expertProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => !isBooking && setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-6">
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Book {player.name}</h3>
              
              {bookingMessage && <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">{bookingMessage}</div>}
              {bookingError && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">{bookingError}</div>}
              
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                    value={bookingForm.bookingDate}
                    onChange={(e) => setBookingForm({...bookingForm, bookingDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                    value={bookingForm.duration}
                    onChange={(e) => setBookingForm({...bookingForm, duration: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Where to meet, specific goals, etc."
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                  ></textarea>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center text-lg mt-4">
                   <span className="font-medium text-gray-700">Total Cost:</span>
                   <span className="font-bold text-green-600">
                     {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(player.expertProfile.hourlyRate * (bookingForm.duration || 1))}
                   </span>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isBooking}>
                    {isBooking ? <LoadingSpinner size="sm" /> : 'Confirm Booking'}
                  </Button>
                </div>
              </form>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerDetailsPage;
