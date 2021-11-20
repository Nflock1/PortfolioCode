import React from 'react';
import {StyleSheet,View,Text, SafeAreaView, ScrollView, TextInput,TouchableOpacity, Button, Alert} from 'react-native';


const STYLES = StyleSheet.create({

    TextStyle: {
        fontWeight: 'bold',
        fontSize: 35,
        color: 'dodgerblue'
    }


});

function SplashScreen(){

return(


    <SafeAreaView style= {{paddingHOrizontal: 20, justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'black'}}>



        {/* <Text style = {STYLES.TextStyle}>You Are Loading In</Text> */}
        <Text style = {STYLES.TextStyle}>Constipated.......</Text>



    </SafeAreaView>




);


}

export default SplashScreen;