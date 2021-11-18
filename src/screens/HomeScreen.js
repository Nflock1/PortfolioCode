import axios from 'axios';
import React from 'react';
import {StyleSheet,View,Text, SafeAreaView, ScrollView, TextInput,TouchableOpacity, Button, Alert} from 'react-native';
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


});

function HomeScreen({navigation}) {
    const {signOut} = React.useContext(AuthContext);


    return(

        <SafeAreaView style = {{justifyContent: 'center', alignItems:'center', flex: 1}}>
            
            <Text>Hello You Are On The HOMEPAGE!</Text>
            <Button title= "Logout" onPress={()=> signOut()}></Button>
            {/* <Button title= "Add Restroom" onPress={() => navigation.navigate('SubmissonScreen')}></Button> */}
            
        </SafeAreaView>


    );

}

export default HomeScreen;