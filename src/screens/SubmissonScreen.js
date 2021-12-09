import { NavigationHelpersContext } from '@react-navigation/core';
import axios from '../axios';
import React from 'react';
import {StyleSheet,View,Text, SafeAreaView, TextInput,TouchableOpacity, Button, Alert} from 'react-native';
import { AuthContext } from '../context';

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


    const restroomHandler = () => {
        let errorFlag = false;

        if(!name.trim()){
            Alert.alert('Name is required field!');
            errorFlag = true;
        }
        if(!address.trim()){
            Alert.alert('Address is required field!');
            errorFlag = true;
        }
        if(!description.trim()) {
            Alert.alert('Description is required field!');
            errorFlag = true;
        }
        if(!errorFlag) {

            Alert.alert('Submission Accepted', 'Click Continue', [
            {text: 'Continue', onPress: () => navigation.navigate('Home')}
            ])
        }
        
    };



    return(

        <SafeAreaView style= {{paddingHOrizontal: 20, flex: 1, backgroundColor: 'white'}}>

            {/* <View style={{alignItems: 'center', marginTop:30}}>
                <Button title= "GO BACK" onPress={()=> navigation.navigate('SignIn')}></Button>            
                <Text>Hello You Are On The Restroom Submission Page!</Text>
            </View> */}
            
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

                <View style = {STYLES.buttonSignIn}>
                        <TouchableOpacity onPress={restroomHandler}>
                            <Text style= {{color: 'white',fontWeight: "bold", fontSize: 18}}> 
                                Submit
                            </Text>
                        </TouchableOpacity>
                </View>    
            </View>

            
            
        </SafeAreaView>


    );

}

export default SubmissionScreen;