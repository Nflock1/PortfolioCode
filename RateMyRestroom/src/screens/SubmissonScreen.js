import { NavigationHelpersContext } from '@react-navigation/core';
import axios from '../axios';
import geolocation from 'axios'
import React from 'react';
import {StyleSheet,View,Text, SafeAreaView, TextInput,TouchableOpacity, Button, Alert} from 'react-native';
import { AuthContext } from '../context';
import { CheckBox } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
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
    textBoxStyle: {

    color: 'black', 
    paddingLeft: 20, 
    height: 40, 
    borderBottomWidth: 0.5, 
    flex: 1, 
    fontSize: 18
    },


});



function SubmissionScreen({navigation}) {
    const {signIn} = React.useContext(AuthContext);

    const [name, setName] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [lat, setLatitude] = React.useState('')
    const [long, setLongitude] = React.useState('')
    const [price_check, setprice] = React.useState(false)
    const [handicap_check, setHandicapBool] = React.useState(false)
    const [gender_check, setGenderBool] = React.useState(false)
    const [cStation_check, setCStationBool] = React.useState(false)

    function convert(bool) {
        if(typeof bool == 'undefined'){
            return 0
        } else if(bool) {
            return 1
        } else {
            return -1
        }
    }
    function restroomHandler() {
    

    // "query = {..... price: convert(boolean)"

        let errorFlag = false;

        if (!name.trim()) {
            Alert.alert('Name is required field!');
            errorFlag = true;
        } else if (!address.trim()) {
            Alert.alert('Address is required field!');
            errorFlag = true;
        } else if (!description.trim()) {
            Alert.alert('Description is required field!');
            errorFlag = true;
        }

        if (!errorFlag) {
            console.log("trying to call api");
            const params = {
                
                access_key: '819aeae120ab09a50702a32d6f4dc305',
                 query: address
            }
            
            //axios call to geolocational api
            geolocation.get('http://api.positionstack.com/v1/forward', {params})

                .then((res) => {
                    //console.log(JSON.stringify(res.data))
                    SecureStore.getItemAsync('keyToken').then((tokenRes) => {
                        console.log(res.data.longitude)
                        axios.post('/api/new-RR', {
                            name: name, description: description, address: address,
                            longitude: res.data.longitude, latitude: res.data.latitude, clean: 0, smell: 0, TP: 0,
                            safety: 0, privacy: 0, busyness: 0, price: convert(price_check), handicap: convert(handicap_check),
                            genderNeutral: convert(gender_check), hygiene: 0, changingStation: convert(cStation_check)
                        }, {headers: {'x-access-token': tokenRes}})
                        .then((result) => {
                            Alert.alert('Restroom added!');
                        })
                        .catch(err => {
                            console.log("couldn't send restroom : " + err.message);
                        });
                    })
                   
                   
                    // setLatitude(res.data.results.latitude)
                    // setLongitude(res.data.results.longitude)
                    // console.log(res)
                })
                .catch(err => {
                    console.log("Error with positionstack api call " + err)
                    Alert.alert('Unable to find address! Try again.')
                })
        }


    }



    return(

        <SafeAreaView style= {{paddingHOrizontal: 20, flex: 1, backgroundColor: 'white'}}>

            {/* <View style={{alignItems: 'center', marginTop:30}}>
                <Button title= "GO BACK" onPress={()=> navigation.navigate('SignIn')}></Button>            
                <Text>Hello You Are On The Restroom Submission Page!</Text>
            </View> */}
            
            <ScrollView keyboardShouldPersistTaps = 'handled'>
                <View style ={{marginTop: 20}}>
                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput
                            placeholder = "Restroom Name"
                            style = {STYLES.textBoxStyle}
                            onChangeText ={(val) => setName(val)}
                        />
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput
                            placeholder = "Address"
                            style = {STYLES.textBoxStyle}
                            onChangeText ={(val) => setAddress(val)}
                        />
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput
                            placeholder = "Description"
                            multiline = {true}
                            style = {STYLES.textBoxStyle}
                            onChangeText ={(val) => setDescription(val)}
                        />
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <CheckBox

                        title= 'Did you have to pay?'
                        checked = {price_check}
                        onPress={() => setprice(!price_check)}
                        />
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <CheckBox

                        title= 'Handicap accessible?'
                        checked = {handicap_check}
                        onPress={() => setHandicapBool(!handicap_check)}
                        />
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <CheckBox

                        title= 'Was there a gender neutral option?'
                        checked = {gender_check}
                        onPress={() => setGenderBool(!gender_check)}
                        />
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <CheckBox

                        title= 'Was there a changing station?'
                        checked = {cStation_check}
                        onPress={() => setCStationBool(!cStation_check)}
                        />
                    </View>
                    
                    <View style = {STYLES.buttonSignIn}>
                            <TouchableOpacity onPress={restroomHandler}>
                                <Text style= {{color: 'white',fontWeight: "bold", fontSize: 18}}> 
                                    Submit
                                </Text>
                            </TouchableOpacity>
                    </View>    
                </View>


            </ScrollView>
            
        </SafeAreaView>


    );

}

export default SubmissionScreen;