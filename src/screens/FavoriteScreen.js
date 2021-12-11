import axios from 'axios';
import React from 'react';
import {StyleSheet,Text, SafeAreaView, ScrollView, TextInput,TouchableOpacity, Button, Alert} from 'react-native';
//import Restroom from './components/Restroom';

const STYLES = StyleSheet.create({
    buttonSignIn: {
        backgroundColor: 'dodgerblue',
        height: 50,
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100

    },


});

function FavoriteScreen({navigation}) {


    return(

        <SafeAreaView justifyContent = 'center' alignItems = 'center'>
            <ScrollView>
            
                <Text>Hello You Are On The FAVORITES PAGE!</Text>
                <Button title= "GO BACK" onPress={()=> navigation.navigate('Home')}></Button> 

            </ScrollView>
        </SafeAreaView>


    );

}

export default FavoriteScreen;