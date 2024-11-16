import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert, View, Button } from 'react-native';

const GOOGLE_PLACES_API_KEY = '';

interface Restaurant {
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
}

const MostrarMapa = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showTraffic, setShowTraffic] = useState<boolean>(false); // State for toggling traffic view

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Error', 'Permiso de localización negado');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        if (location) {
          await fetchNearbyRestaurants(
            location.coords.latitude,
            location.coords.longitude
          );
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener la ubicación');
      }
    })();
  }, []);

  const fetchNearbyRestaurants = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`
      );

      const data = await response.json();

      if (data.status === 'OK') {
        setRestaurants(data.results);
      } else {
        Alert.alert('Error', 'No se pudieron obtener los restaurantes cercanos');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al buscar restaurantes');
    }
  };

  // Function to toggle traffic display
  const toggleTraffic = () => {
    setShowTraffic((prevState) => !prevState);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        showsTraffic={showTraffic} // Controlled by the state
        region={{
          latitude: location?.coords.latitude || 37.78825,
          longitude: location?.coords.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Mi ubicación"
            pinColor="blue"
          />
        )}

        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.place_id}
            coordinate={{
              latitude: restaurant.geometry.location.lat,
              longitude: restaurant.geometry.location.lng,
            }}
            title={restaurant.name}
            pinColor="red"
          />
        ))}
      </MapView>

      {/* Button to toggle traffic view */}
      <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Button
          title={showTraffic ? "Ocultar Tráfico" : "Mostrar Tráfico"}
          onPress={toggleTraffic}
        />
      </View>
    </View>
  );
};

export default MostrarMapa;
