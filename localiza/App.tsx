import React, { useEffect, useState, useRef } from 'react';
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

// conexão com a api
const fetchData = async () => {
  try {
    const response = await fetch('http://dados.recife.pe.gov.br/ar/api/3/action/datastore_search?resource_id=1329a80b-c4a6-4ecd-b8e5-09ef75ffa576');
    const data = await response.json();
    return data.result.records;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return [] as Ponto[]; // tipagem 
  }
};

//define os tipos das variaveis 
interface Ponto {
  longitude: number;
  latitude: number;
  id: string;
}

//armazena os pontos de localização do usuário
export default function App() {
  const [pontos, setPontos] = useState<Ponto[]>([]); // correcao da tipagem
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  // permissao p acesso de localizacao
  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();
    //se concedida
    if (granted) {
      try {
        const currentPosition = await getCurrentPositionAsync({});
        setLocation(currentPosition);
      } catch (error) { //se não concedida
        console.error('Erro ao obter a localização:', error);
      }
    } else {
      console.warn('Permissão de localização não concedida.');
    }
  }

  // pega pontos da api
  useEffect(() => {
    async function pegarPonto() {
      const dados = await fetchData();
      setPontos(dados);
    }

    pegarPonto();
  }, []);

  //pede permissão ao usuário 
  useEffect(() => {
    requestLocationPermission();
  }, []);

  //observa a localização do usuario e atualiza a perspectiva da câmera
  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        mapRef.current?.animateCamera({
          pitch: 70,
          center: response.coords,
        });
        setLocation(response);
      }
    );
  }, []);
console.log(location)
console.log(pontos)
  return (
    <View style={styles.container}>
      {location && (
        //mostra a loc do usuario e os pontos de interesse, se disponivel...
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude ? location.coords.latitude:0,
            longitude: location.coords.longitude ? location.coords.longitude:0,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          //se disponivel apresenta um marcador do ponto de interesse
          <Marker
            coordinate={{
              latitude: location.coords.latitude ? location.coords.latitude:0,
              longitude: location.coords.longitude ? location.coords.longitude:0, 
            }}
          />
          {pontos.map((ponto) => (
            <Marker
              key={ponto.id} // add uma chave única p ada elemento 
              coordinate={{
                latitude: ponto.latitude ? ponto.latitude:0,
                longitude: ponto.longitude ? ponto.longitude:0,
              }}
              image={require('./assets/sinal-wifi.png')}
            />
          ))}
        </MapView>
      )}
      {location && (
        <Text>
          Localização Atual: Lat {location.coords.latitude}, Long{' '}
          {location.coords.longitude}
        </Text>
      )}
    </View>
  );
}
