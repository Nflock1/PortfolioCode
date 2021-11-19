import axios from 'axios';
import React from 'react';
import {StyleSheet,View,Text, SafeAreaView, ScrollView, TextInput,TouchableOpacity, Button, Alert} from 'react-native';

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
                    />
                </View>

                <View style ={{flexDirection: 'row', marginTop:20}}>
                    <TextInput
                        placeholder = "Address"
                        style = {STYLES.textBoxStyle}
                    />
                </View>

                <View style ={{flexDirection: 'row', marginTop:20}}>
                    <TextInput
                        placeholder = "Description"
                        multiline = {true}
                        style = {STYLES.textBoxStyle}
                    />
                </View>

                <View style = {STYLES.buttonSignIn}>
                        <TouchableOpacity onPress={() => Alert.alert('Success!', 'Your submission was submitted', [
                            {text: 'Go Back Home', onPress: ()=> navigation.navigate('Home')}
                        ]) }>
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