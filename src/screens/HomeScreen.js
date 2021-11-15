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


});

function HomeScreen({navigation}) {


    return(

        <SafeAreaView style = {{justifyContent: 'center', alignItems:'center', flex: 1}}>
            
            <Text>Hello You Are On The HOMEPAGE!</Text>
            <Button title= "GO BACK" onPress={()=> navigation.navigate('SignIn')}></Button>
            
        </SafeAreaView>


    );

}

export default HomeScreen;