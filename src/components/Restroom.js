import React from 'react';
import {
    StyleSheet,
    View,
    Text, 
    SafeAreaView, 
    ScrollView, 
    TextInput,
    TouchableOpacity,
    Button, 
    Alert } from 'react-native';

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#fff',
        shadowOffset: {width: 1, height: 1},
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        marginHorizontal: 4,
        marginVertical: 6,
        


    },
    cardContent: {
        marginHorizontal: 18,
        marginVertical: 10
    }
});




function Restroom(props){

    return(

        <View style={styles.card}>
            <View style={styles.cardContent}>
                {props.children}
            </View>
        </View>


    );

}

export default Restroom;