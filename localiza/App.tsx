import { useEffect, useState, useRef} from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text } from 'react-native';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from 'expo-location';

import { styles } from './styles';

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef <MapView>(null);

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) { 
      try {
        const getCurrentPosition = await getCurrentPositionAsync({});
        setLocation(getCurrentPosition); 

      } catch (error) {
        console.error('Erro ao obter a localização:', error);
      }
    } else {
      console.warn('Permissão de localização não concedida.');
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  //observando rota 
  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1 
    }, (response) => { 
      //posicao dacamera no mapa 
      mapRef.current?.animateCamera ({
        pitch: 70,
        center:  response.coords
      })
      setLocation(response);
    })
  }, [])

  return (
  <View style={styles.container}>
    {
      location && 
    <MapView 
      ref={mapRef}
      style = {styles.map}
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005, // precisao da localizacao 
        longitudeDelta: 0.005,
      }}
    >
      <Marker
      //objt p passar latitude e longitude 
      coordinate={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }}
      />
      </MapView>
      }
  </View>);
}
