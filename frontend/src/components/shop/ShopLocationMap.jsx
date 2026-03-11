import React from 'react';
import { GoogleMap, useJsApiLoader, Marker as GoogleMarker } from '@react-google-maps/api';
import { MapContainer, TileLayer, Marker as LeafletMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '1.5rem'
};

const ShopLocationMap = ({ shop }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const useGoogleMaps = apiKey.length > 0;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  // Only render if latitude and longitude exist
  if (!shop?.latitude || !shop?.longitude) {
    return null;
  }

  const center = {
    lat: shop.latitude,
    lng: shop.longitude
  };

  if (useGoogleMaps) {
    if (loadError) {
      return null;
    }

    if (!isLoaded) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-3xl flex items-center justify-center">
              <span className="text-gray-400 font-bold">Loading Map...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Vị trí Cửa hàng
          </h2>
        </div>
        <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 relative">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
              styles: [
                {
                  "featureType": "poi",
                  "stylers": [{ "visibility": "off" }]
                }
              ]
            }}
          >
            <GoogleMarker position={center} title={shop.name} />
          </GoogleMap>
        </div>
      </div>
    );
  }

  // Fallback to OpenStreetMap
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Vị trí Cửa hàng
        </h2>
      </div>
      <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 relative" style={{ height: '400px' }}>
        <MapContainer 
          center={[center.lat, center.lng]} 
          zoom={15} 
          style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LeafletMarker position={[center.lat, center.lng]} />
        </MapContainer>
      </div>
    </div>
  );
};

export default ShopLocationMap;
