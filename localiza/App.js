import { useState } from 'react';
import { View } from 'react-native'
import {
  requestForegruopPermissionAsync
  getCurrentPositionAsync
} from 'expo-location';

import { style } from './styles';

export default function App() {

  const [location, setlocatio] = usestate(null);

  async function requestLocationPermission(){
   const {granted} = await requestLocationPermission();
  }

  if(granted){
    const getCurrentPosition = await getCurrentPositionAsync();
  }

  return (
    <View style={styles.container}>
  
    </View>
  );
}
