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

//conexão com api 
const fetchData = async () => {
    const response = await fetch('http://dados.recife.pe.gov.br/ar/api/3/action/datastore_search?resource_id=1329a80b-c4a6-4ecd-b8e5-09ef75ffa576').then((res)=>res.json()).then((res)=>res.result.records);
    return response; 
};


export default function App() {

  const [pontos, setPontos] = useState([]); 

  const [location, setLocation] = useState<LocationObject | null>(null);
  // acessa o animatte Camera
  const mapRef = useRef <MapView>(null);

  //permissao da camera
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
  // pega os pontos
 useEffect( () => { 
 async function pegarPonto(){
  const dados = await fetchData();
  setPontos(dados);
}

pegarPonto()
}, [])

  useEffect(() => {
    requestLocationPermission();
  }, []);

  //observando rota e precisao da mesma
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
      {
          pontos.map(ponto => { 
            console.log(ponto) 
          return <text> tirando erro </text>   
            //return ( <Marker 
            //objt p passar latitude e longitude 
          //coordinate={{
            //latitude: ponto.latitude,
           // longitude: ponto.longitude,
          //}}
          //image = { require ('./assets/sinal-wifi.png')}
        //  >)
        })
      }
      </MapView>
      }
  </View>);
}
