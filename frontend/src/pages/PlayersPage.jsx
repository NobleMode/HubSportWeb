import { Link } from 'react-router-dom';
import { useGetUsersQuery } from '../services/userApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import React from 'react';

/**
 * Players Page
 * Displays list of all registered users
 */
const PlayersPage = () => {
  const { data, isLoading, error } = useGetUsersQuery();
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
              
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'EXPERT' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
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
