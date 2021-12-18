import React from 'react';
import {StyleSheet,View,Text, SafeAreaView, ScrollView, TextInput,TouchableOpacity, Alert} from 'react-native';
import axios from '../axios';
import { AuthContext } from '../context';
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
    buttonGuest:{

        backgroundColor: 'black',
        height: 50,
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100

    },
    line: {
        height: 1,
        width: 30,
        backgroundColor: 'blue'

    },
    textDanger: {
        color: "red"
    }

});



function SignInScreen({navigation}) {
    
    const {signIn} = React.useContext(AuthContext);
    const {enterAsGuest} = React.useContext(AuthContext);

    // const [key, setKey] = React.useState('');
    // const [value, setValue] = React.useState('');
    const [results, onChangeResult] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [token, setToken] = React.useState(''); //Might not need this state value

    async function save(key, value) {
        let res = await SecureStore.setItemAsync(key, value);
        console.log("res: " + JSON.stringify(res))
    }

    async function getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);
        if(result) {
            onChangeResult(result);
        } else {
            console.log("Wrong Key for acessing token");
        }
    }

    const checkInputFields = () => {
        let errorFlag = false;

        if(!username.trim()){
            Alert.alert('Username required field!');
            errorFlag = true;
        }else if(!password.trim()){
            Alert.alert('Password required field!');
            errorFlag = true;
        }
        
        let userAccess = true; //Change to false after done with testing

        if(!errorFlag) {


            if(!userAccess) { // test if statment delete  after done (Won't enter here for the test)

                axios
                .post('/api/login', {username: username, password: password})

                    .then((results) =>  {
                    console.log('User Signed In');
                    save(keyToken,results.data); //Saving token on device
                    //setToken(results.data);
                    access = true;
                })
                        .catch(err => {
                            console.log(err)
                            Alert.alert(err);
                })

            }

            if(userAccess){

                save('keyToken', 'JWT')
                .then(async()=>{
                    await getValueFor('keyToken');
                    console.log('in SignInScreen');
                }) 
                

                Alert.alert('Signing You In', 'Click Continue', [
                    {text: 'Continue', onPress: () => signIn()}
                    ]);

            }
        }
        
    };



    return(

        <SafeAreaView style= {{paddingHorizontal: 20, flex: 1, backgroundColor: 'white'}}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{alignItems: 'center', marginTop: 40}} >

                    <Text style = {{fontWeight: 'bold',alignItems: 'center', fontSize: 35, color: 'dodgerblue'}}>
                        RateMyRestroom
                    </Text>
                  
                </View> 

                <View style={{marginTop: 70, paddingLeft: 10}}>                 
                    <Text style={{fontWeight: 'bold', fontSize: 25, color: 'black'}}> 
                        Welcome Fellow Pooper!
                    </Text>
                    <Text style = {{fontWeight: 'bold', fontSize: 19, color: 'lightgrey'}}>
                        Already A User? Sign In
                    </Text>
                </View>
        
                <View style ={{marginTop: 20}}>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput 
                        placeholder= "Username" 
                        style = {{
                            color: 'black', 
                            paddingLeft: 20, 
                            height: 40, 
                            borderBottomWidth: 0.5, 
                            flex: 1, 
                            fontSize: 18}}
                            onChangeText ={(val) => setUsername(val)} />
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput placeholder= "Password" 
                        style = {{color: 'black', 
                        paddingLeft: 20, 
                        height: 40, 
                        borderBottomWidth: 0.5, 
                        flex: 1, 
                        fontSize: 18}} 
                        secureTextEntry
                        onChangeText ={(val) => setPassword(val)}/>
                    </View>

                    <View style = {STYLES.buttonSignIn}>
                        <TouchableOpacity onPress={checkInputFields}>
                            <Text style= {{color: 'white',fontWeight: "bold", fontSize: 18}}> 
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{marginVertical:20, flexDirection: 'row', justifyContent: 'center',alignItems: 'center'}}>
                        <Text style = {{fontWeight:"bold", marginHorizontal: 5}}>- OR -</Text>
                    </View>    

                </View>


                <View style = {STYLES.buttonGuest}>
                    <TouchableOpacity onPress={() => enterAsGuest()}>
                        <Text style= {{color: 'white',fontWeight: "bold", fontSize: 18}}>
                         Enter As Guest
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginTop: 40, marginBottom: 20}}>

                    <Text style={{color: 'lightgrey', fontWeight: "bold"}}>Don't have an account? </Text>
                    <TouchableOpacity onPress={ ()=> navigation.navigate('Sign Up')}>
                        <Text style={{color: 'aqua', fontWeight: "bold"}}>SIGN UP</Text>
                    </TouchableOpacity>
                    
                </View>     
            </ScrollView>
        </SafeAreaView>


    );

}

export default SignInScreen;