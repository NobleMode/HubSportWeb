import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker as GoogleMarker } from '@react-google-maps/api';
import { MapContainer, TileLayer, Marker as LeafletMarker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
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
  height: '300px',
  borderRadius: '0.75rem'
};

const defaultCenter = {
  lat: 21.0132,
  lng: 105.5262
};

// Component to handle clicks on Leaflet map
const LeafletEvents = ({ setMarkerPosition, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setMarkerPosition({ lat, lng });
      
      // Reverse geocoding using Nominatim (OSM)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
           onLocationSelect({ lat, lng, address: data.display_name || '' });
        })
        .catch(() => {
           onLocationSelect({ lat, lng, address: '' });
        });
    },
  });
  return null;
};

const LocationPicker = ({ initialLocation, onLocationSelect }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const useGoogleMaps = apiKey.length > 0;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const [markerPosition, setMarkerPosition] = useState(
    initialLocation && initialLocation.lat && initialLocation.lng
      ? initialLocation
      : defaultCenter
  );

  const onGoogleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });

    if (window.google && window.google.maps && window.google.maps.Geocoder) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        let address = '';
        if (status === 'OK' && results[0]) {
          address = results[0].formatted_address;
        }
        onLocationSelect({ lat, lng, address });
      });
    } else {
      onLocationSelect({ lat, lng, address: '' });
    }
  }, [onLocationSelect]);

  if (useGoogleMaps) {
    if (loadError) {
      return (
        <div className="bg-red-900/20 text-red-500 border border-red-500/50 p-4 rounded-xl text-center">
          Error loading Google Maps
        </div>
      );
    }
    if (!isLoaded) {
      return (
        <div className="w-full h-[300px] bg-gray-800 rounded-xl flex items-center justify-center animate-pulse border border-white/10">
          <span className="text-gray-400">Loading Map...</span>
        </div>
      );
    }

    return (
      <div className="relative border border-white/10 rounded-xl overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition}
          zoom={markerPosition === defaultCenter ? 12 : 15}
          onClick={onGoogleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
              { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
              { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
              { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
              { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
              { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
              { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
              { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
              { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
              { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
              { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
              { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
              { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
              { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
            ]
          }}
        >
          <GoogleMarker position={markerPosition} />
        </GoogleMap>
        <div className="absolute top-2 left-2 right-2 bg-black/60 backdrop-blur-md p-2 rounded-lg text-xs text-center border border-white/20 shadow-lg pointer-events-none text-white font-medium">
          Click on the map to set your store location
        </div>
      </div>
    );
  }

  // Fallback to OpenStreetMap
  return (
    <div className="relative border border-gray-200 rounded-xl overflow-hidden" style={{ height: '300px' }}>
      <MapContainer 
        center={[markerPosition.lat, markerPosition.lng]} 
        zoom={markerPosition === defaultCenter ? 12 : 15} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LeafletMarker position={[markerPosition.lat, markerPosition.lng]} />
        <LeafletEvents setMarkerPosition={setMarkerPosition} onLocationSelect={onLocationSelect} />
      </MapContainer>
      <div className="absolute top-2 left-2 right-2 bg-black/60 backdrop-blur-md p-2 rounded-lg text-xs text-center border border-white/20 shadow-lg pointer-events-none text-white font-medium z-[1000]">
        Click on the map to set your store location (Powered by OpenStreetMap)
      </div>
    </div>
  );
};

export default LocationPicker;
