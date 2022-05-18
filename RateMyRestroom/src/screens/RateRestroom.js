import axios from '../axios';
import React from 'react';
import {StyleSheet,Text, SafeAreaView, View, ScrollView, TextInput,TouchableOpacity, Button, Alert} from 'react-native';
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

function RateRestroom(props, navigation){
    const [restroomName] = props.route.params.restrooms.restroomName;
    const [cleanliness, setCleanliness] = React.useState(1);
    const [smell, setSmell] = React.useState(1);
    const [tpQuality, setTpQuality] = React.useState(1);
    const [safety, setSafety] = React.useState(1);
    const [busyness, setBusyness] = React.useState(1);
    const [privacy, setPrivacy] = React.useState(1);

    const checkFields = () => {
        let errorFlag = false;

        if(cleanliness > 5){           
            Alert.alert('Cleanliness is required field!');
            errorFlag = true;

        }else if(smell > 5){
            Alert.alert('Smell is required field!');
            errorFlag = true;

        }else if(tpQuality > 5){
            Alert.alert('Quality of Toilet Paper is required field!');
            errorFlag = true;

        }else if(safety > 5){
            Alert.alert('Safety is required field!');
            errorFlag = true;

        }else if(busyness > 5){
            Alert.alert('Busyness of Restroom is required field!');
            errorFlag = true;

        }else if(privacy > 5){
            Alert.alert('Restroom Privacy is required field!');
            errorFlag = true;

        }
        if(!errorFlag){ //Info to back end
            const params = 
            {
                restroomName: restroomName,
                username: "guest",
                cleanliness: cleanliness,
                smell: smell,
                tpQuality: tpQuality,
                safety: safety,
                busyness: busyness,
                privacy: privacy,
            }
            SecureStore.getItemAsync('keyToken').then((result) =>{
                axios.post('/api/new-review', params, {headers: {'x-access-token':result}})
                .then((res) => {
                  Alert.alert('Signing You In', 'Click Continue', [
                      {text: 'Continue', onPress: () => navigation.navigate("Home")}
                     ]);
                })
                .catch(err => {
                    console.log(err);
                })
            })
            

        }

    };


    return(


        <SafeAreaView style= {{paddingHorizontal: 20, flex: 1, backgroundColor: 'white'}}>
            <ScrollView>
                <View style ={{marginTop: 20}}>
                    <Text>Rate Catergories Out of 5</Text>
                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput
                            placeholder = "Cleanliness of Restroom"
                            keyboardType='numeric'
                            style = {STYLES.textBoxStyle}
                            onChangeText ={(val) => setCleanliness(val)}
                        />
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput
                            placeholder = "Smell of Restroom"
                            keyboardType='numeric'
                            style = {STYLES.textBoxStyle}
                            onChangeText ={(val) => setSmell(val)}
                        />
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput
                            placeholder = "Quality of Toilet Paper"
                            keyboardType='numeric'
                            style = {STYLES.textBoxStyle}
                            onChangeText ={(val) => setTpQuality(val)}
                        />
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput
                            placeholder = "Safety"
                            keyboardType='numeric'
                            style = {STYLES.textBoxStyle}
                            onChangeText ={(val) => setSafety(val)}
                        />
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput
                            placeholder = "Busyness of Restroom"
                            keyboardType='numeric'
                            style = {STYLES.textBoxStyle}
                            onChangeText ={(val) => setBusyness(val)}
                        />
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput
                            placeholder = "Restroom Privacy"
                            keyboardType='numeric'
                            style = {STYLES.textBoxStyle}
                            onChangeText ={(val) => setPrivacy(val)}
                        />
                    </View>

                    <View style = {STYLES.buttonSignIn}>
                            <TouchableOpacity onPress={checkFields}>
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

export default RateRestroom;
