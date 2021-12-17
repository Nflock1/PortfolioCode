import axios from 'axios';
import React from 'react';
import {StyleSheet,Text, 
        SafeAreaView,
        View, 
        ScrollView, 
        TextInput,
        TouchableOpacity, 
        Button, 
        Alert, 
        Modal} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Restroom from '../components/Restroom';
import RateRestroom from './RateRestroom';

const styles= StyleSheet.create({
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

    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalRate, setModalRate] = React.useState(false);
    const [restrooms, setRestrooms] = React.useState([

        {RestroomName: 'Home', Address: '1326 Chandler', Description: 'Stinky, I would not go here', key:1},
        {RestroomName: 'Grainger Hall', Address: '975 University Ave', Description: 'Clean but outdated bathrooms', key: 2},
        {RestroomName: 'Captial', Address: '2 E Main St', Description: 'Very fancy bathrooms', key: 3},
        {RestroomName: 'Crumbl Cookie', Address: '4010 University Ave', Description: 'Found a cookie on the toilet seat, 10 out of 10', key:4}
        
    ]);


    return(

        <SafeAreaView justifyContent = 'center' alignItems = 'center'>

            <Modal visible={modalOpen} animationType='slide'>
                <SafeAreaView>
                    <Text>These are restroom details</Text>
                    <Button title='close' onPress={() => setModalOpen(false)}/>
                </SafeAreaView>
            </Modal>

            <Modal visible={modalRate} animationType='slide'>
                <SafeAreaView>
                    <Text>Test Modal for Rate Screen</Text>
                    <RateRestroom/>
                    <Button title='close' onPress={() => setModalRate(false)}/>
                </SafeAreaView>
            </Modal>

            <FlatList
                data={restrooms}
                renderItem={({item}) => (

                <Restroom>

                    <Text>{item.RestroomName}</Text>
                    <Text>{item.Address}</Text>
                    <View style = {{flexDirection: 'row'}}>
                        <Button title='Rate' onPress={() => setModalRate(true)}/>
                        <Button title='Details' onPress={() => setModalOpen(true)}/>
                    </View>


                </Restroom>
                    

                )}
            
            />

        </SafeAreaView>


    );

}

export default FavoriteScreen;