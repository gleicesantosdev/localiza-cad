import { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { View, Text } from 'react-native';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
} from 'expo-location';

import { styles } from './styles';

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);

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

  return (
  <View style={styles.container}>
    <MapView
      style = {styles.map}
    />
  </View>);
}
