import axios from '../axios';
import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet,View, Text, SafeAreaView, Button, Dimensions, Alert} from 'react-native';
import { AuthContext } from '../context';
import * as Location from 'expo-location';
import RestroomMarker from './restroomMarker';
import SplashScreen from './SplashScreen';
import * as SecureStore from 'expo-secure-store';
const STYLES = StyleSheet.create({
    buttonSignIn: {
        backgroundColor: 'dodgerblue',
        height: 50,
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100

    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 2,
      },


});

function HomeScreen({navigation}) {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [mapRegion, setMapRegion] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [restrooms, setRestrooms] = useState([]);



  useEffect(() => {
    (async () => {
        

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
          longitudeDelta: 0.0922,
          latitudeDelta:0.0421
      })

      const params = {
        longitude: parseFloat(location.coords.longitude),
        latitude: parseFloat(location.coords.latitude),
        radius: 5
        }
        let newarr = [];
        let result = await axios.get("/api/near-RR", {params});
        for (var i = 0; i < Object.keys(result.data.data).length; ++i) {
                        const restroom ={
                            latlng: 
                                    {
                                    longitude: Number(result.data.data[i].longitude),
                                    latitude: Number(result.data.data[i].latitude),
                                    },
                            longitudeDelta: 0.0922,
                            latitudeDelta: 0.0421,
                            title: result.data.data[i].name,
                        };
                        newarr[i] = restroom;
                    }
        setRestrooms(newarr);
        setLoading(false);
    })();
  }, []);

  if (isLoading) {
    return (SplashScreen());
  }
    return(

        <SafeAreaView style = {{justifyContent: 'center', alignItems:'center', flex: 1}}>
            
            <MapView style={STYLES.map} initialRegion={mapRegion} showsUserLocation={true} >
                {restrooms ? restrooms.map((restrooms, index) => (
                    <Marker
                    key={index}
                    coordinate={restrooms.latlng}
                    title = {restrooms.title}
                    />
                )): null}
            </MapView>
            <Text>Hello You Are On The HOMEPAGE!</Text>
            <Button title= "Logout" onPress={()=> signOut()}></Button>
            {/* <Button title= "Add Restroom" onPress={() => navigation.navigate('SubmissonScreen')}></Button> */}
            
        </SafeAreaView>



    );


}

export default HomeScreen;