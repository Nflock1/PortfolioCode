import axios from 'axios';
import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet,View,Text, SafeAreaView, ScrollView, TextInput,TouchableOpacity, Button, Alert, Dimensions} from 'react-native';
import { AuthContext } from '../context';
import * as Location from 'expo-location';

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
    const [restrooms, setRestrooms] = useState(null);
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
            latitudeDelta: 0.0421
        })
        setLocation(location);

        const params = {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
            radius: 5
        }
        function getRestrooms() {
            axios.get("http://localhost:5000/api/near-RR", {params})
                
                .then((result) => {
                    setRestrooms(result)
                })
                .catch(err => {
                    console.log("Could not load restrooms.")
                })
        }
        })();
      }, []);

    return(

        <SafeAreaView style = {{justifyContent: 'center', alignItems:'center', flex: 1}}>
            <MapView initialRegion= {mapRegion} style={STYLES.map}>
                <Marker coordinate={mapRegion}></Marker>  

                {restrooms ? restrooms.map(restrooms => {
                    <Marker coordinate={restrooms.longitude, restrooms.latitude}/>
                }): null}                  
            </MapView>
            
            <Text>Hello You Are On The HOMEPAGE!</Text>
            <Button title= "Logout" onPress={()=> signOut()}></Button>
            {/* <Button title= "Add Restroom" onPress={() => navigation.navigate('SubmissonScreen')}></Button> */}
            
        </SafeAreaView>



    );

}

export default HomeScreen;