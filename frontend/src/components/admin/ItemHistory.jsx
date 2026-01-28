import React from 'react';
import { useGetItemHistoryQuery } from '../../services/productApi';
import LoadingSpinner from '../common/LoadingSpinner';

const ItemHistory = ({ itemId }) => {
    const { data, isLoading } = useGetItemHistoryQuery(itemId);
    const history = data?.data || [];

    if (isLoading) return <LoadingSpinner size="sm" />;

    if (history.length === 0) {
        return <div className="text-gray-500 text-sm p-4">No history found for this item.</div>;
    }

    return (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            {history.map((event, index) => (
                <div key={index} className="flex gap-4 border-l-2 border-gray-200 pl-4 py-1">
                    <div className="flex-shrink-0 w-24 text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                        <br />
                        {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                event.eventType === 'MAINTENANCE' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                                {event.eventType}
                            </span>
                            {event.eventType === 'MAINTENANCE' && (
                                <span className="text-xs font-semibold text-gray-700">{event.type}</span>
                            )}
                            {event.eventType === 'RENTAL' && (
                                <span className="text-xs font-semibold text-gray-700">{event.order?.status}</span>
                            )}
                        </div>
                        
                        {event.eventType === 'MAINTENANCE' && (
                            <div className="text-sm mt-1">
                                <p>{event.description}</p>
                                {event.cost > 0 && <p className="text-xs text-gray-500">Cost: {event.cost.toLocaleString()} VND</p>}
                                {event.performedBy && <p className="text-xs text-gray-500">By: {event.performedBy}</p>}
                            </div>
                        )}
                        
                        {event.eventType === 'RENTAL' && (
                            <div className="text-sm mt-1">
                                <p>Order #{event.order?.id?.slice(0, 8)}</p>
                                <p className="text-xs text-gray-500">User: {event.order?.user?.name || event.order?.user?.email}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemHistory;
