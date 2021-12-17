import axios from '../axios';
import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet,View, Text, SafeAreaView, Button, Dimensions, Alert} from 'react-native';
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
    const [mapRegion, setMapRegion] = useState({
        longitude: -90,
        latitude: 0,
        longitudeDelta: 180,
        latitudeDelta: 90});
    const [restrooms, setRestrooms] = useState([
        {   
            id: 1,
            latlng: {
                latitude: 43.068096178875685,
                longitude:-89.4044798846011
            },
            title: "dons",
            description: "ok",
        },
        {
            latlng: 
            {latitude: 43.0677235708863,
            longitude:-89.41025657181031
            },
            title: "bar",
            id: 2,
            description: "bad",
        }
    ]);
    const {signOut} = React.useContext(AuthContext);
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
            const params = {
                longitude: parseFloat(location.coords.longitude),
                latitude: parseFloat(location.coords.latitude),
                radius: 5
            }
            let newarr = [];
            let result = await axios.get("/api/near-RR", {params});
            for (var i = 0; i < Object.keys(result.data.data).length; ++i) {
                                const restroom ={
                                    latlng: {longitude: result.data.data[i].longitude,
                                    latitude: result.data.data[i].latitude,},
                                    longitudeDelta: 0.0922,
                                    latitudeDelta: 0.0421
                                };
                                newarr[i] = restroom;
                            }
            setRestrooms(newarr);
        
        })();
      }, []);

    return(

        <SafeAreaView style = {{justifyContent: 'center', alignItems:'center', flex: 1}}>
            <MapView region= {mapRegion} style={STYLES.map}
            loadingEnabled = {true}
            loadingIndicatorColor="#666666"
            loadingBackgroundColor="#eeeeee"
            moveOnMarkerPress = {false}
            showsUserLocation={true}
            showsCompass={true}
            showsPointsOfInterest = {false}
            provider="google">
                
                {console.log("map region: " +JSON.stringify(mapRegion))}
                <Marker coordinate={mapRegion}></Marker>  
                {restrooms ? restrooms.map((restrooms, index) => {
                    <Marker 
                    key={index}
                    coordinate={restrooms.latlng}
                    title={restrooms.title}
                    description={restrooms.description}>

                    </Marker>
                }): console.log("Didn't work")}                
            </MapView>
            <Text>Hello You Are On The HOMEPAGE!</Text>
            <Button title= "Logout" onPress={()=> signOut()}></Button>
            {/* <Button title= "Add Restroom" onPress={() => navigation.navigate('SubmissonScreen')}></Button> */}
            
        </SafeAreaView>



    );


}

export default HomeScreen;