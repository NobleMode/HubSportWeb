import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetUsersByRoleQuery } from '../services/userApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import React from 'react';

/**
 * Players Page
 * Displays list of all registered users
 */
const PlayersPage = () => {
  const [filters, setFilters] = useState({
    specialization: '',
    level: '',
    city: ''
  });

  // Convert empty strings to undefined for RTK Query so it omits them from the URL if empty
  const queryParams = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== '')
  );

  const { data, isLoading, error } = useGetUsersByRoleQuery({ role: 'expert', params: queryParams });
  const currentUser = useSelector(selectCurrentUser);
  
  const users = React.useMemo(() => {
    const allUsers = data?.data || [];
    if (!currentUser) return allUsers;
    return allUsers.filter(user => user.id !== currentUser.id);
  }, [data, currentUser]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading players: {error.message || 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Player to Play With</h1>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sport (Specialization)</label>
            <input 
              type="text" 
              placeholder="e.g. Tennis, Football" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-900"
              value={filters.specialization}
              onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-900"
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Professional">Professional</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location (City)</label>
            <input 
              type="text" 
              placeholder="e.g. Hanoi, Ho Chi Minh" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-900"
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <Link to={`/players/${user.id}`} key={user.id} className="block group">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform transform hover:-translate-y-1 hover:shadow-lg h-full">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold uppercase mb-4 group-hover:bg-primary-200 transition-colors">
                  {user.name ? user.name.charAt(0) : user.email.charAt(0)}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 truncate w-full group-hover:text-primary-600">
                  {user.name || 'Unnamed Player'}
              </h3>
              <p className="text-sm text-gray-500 truncate w-full mb-3">{user.email}</p>
              
               <div className="mb-4 flex flex-col items-center gap-2">
                 <div className="flex items-center gap-2">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                     user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                     user.role === 'EXPERT' ? 'bg-blue-100 text-blue-800' :
                     'bg-green-100 text-green-800'
                   }`}>
                     {user.role}
                   </span>
                   {user.role === 'EXPERT' && user.expertProfile && (
                     <span className={`w-2.5 h-2.5 rounded-full ${user.expertProfile.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} title={user.expertProfile.isAvailable ? 'Available' : 'Unavailable'}></span>
                   )}
                 </div>
                 
                 <div className="flex flex-row flex-wrap justify-center items-center gap-3 text-xs text-gray-500">
                   {user.expertProfile?.specialization && (
                      <span className="font-medium text-gray-600">
                        🎾 {user.expertProfile.specialization}
                      </span>
                   )}
                   {user.expertProfile?.level && (
                      <span className="flex items-center gap-1">
                        ⭐ {user.expertProfile.level}
                      </span>
                   )}
                   {user.address && (
                      <span className="flex items-center gap-1">
                        📍 {user.address}
                      </span>
                   )}
                 </div>
               </div>

               <div className="mt-auto pt-4 border-t w-full text-sm text-gray-500 flex justify-between">
                  <span>Joined:</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
               </div>
            </div>
          </Link>
        ))}
      </div>
       
       {users.length === 0 && (
         <div className="text-center py-12 text-gray-500">
            No players found.
         </div>
       )}
    </div>
  );
};

export default PlayersPage;
