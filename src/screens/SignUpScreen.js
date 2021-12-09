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

    }

});

function SignUpScreen({navigation}) {
    const {signUp} = React.useContext(AuthContext);
    const {enterAsGuest} = React.useContext(AuthContext);

    const [newUsername, setNewUser] = React.useState(''); //New Username to be pushed to the backend
    const [newPassword, setNewPassword] = React.useState(''); //New Password to be pushed to the backend
    const [confirmPasssord, setConfirmPassword] = React.useState(''); //Used to confirm the password is written correctly

    

        const SignUpHandler = () =>{

            let errorFlag = false;

            if(!newUsername.trim()){
                Alert.alert('Username required field!');
                errorFlag = true;
            }
            if(!newPassword.trim()){
                Alert.alert('Password required field!');
                errorFlag = true;
            }
            if(newPassword != confirmPasssord){
                Alert.alert('Passwords do not match!');
                errorFlag = true;
            }
            if(!errorFlag) {
                console.log("Bro, Eat my ass " + newUsername + " ; " + newPassword)
                axios
                    .post('http://192.168.0.126:5000/api/register', {username: newUsername, password: newPassword})
                        .then(() => console.log('Registered New User'))
                            .catch(err => {
                            console.log(err)
                })
                Alert.alert('Sign In Sucessful', 'Click Continue', [
                    {text: 'Continue', onPress: () => signUp()}
                    ])
            }

        }

    return(

        <SafeAreaView style= {{paddingHOrizontal: 20, flex: 1, backgroundColor: 'white'}}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{alignItems: 'center', marginTop: 40}} >

                    <Text style = {{fontWeight: 'bold',alignItems: 'center', fontSize: 35, color: 'dodgerblue'}}>
                        RateMyRestroom
                    </Text>
                  
                </View> 

                <View style={{marginTop: 70, alignContent: 'center'}}>                 
                    <Text style={{fontWeight: 'bold', fontSize: 25, color: 'black'}}> 
                        Welcome New Pooper!
                    </Text>
                    <Text style = {{fontWeight: 'bold', fontSize: 19, color: 'lightgrey'}}>
                        Sign Up To Continue
                    </Text>
                </View>
        
                <View style ={{marginTop: 20}}>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput placeholder= "New Username" 
                        style = {{color: 'black'
                        , paddingLeft: 20, 
                        height: 40, 
                        borderBottomWidth: 0.5, 
                        flex: 1, 
                        fontSize: 18}}
                        onChangeText = {(val) => setNewUser(val)}
                        />
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput placeholder= "New Password" 
                        style = {{color: 'black', 
                        paddingLeft: 20, 
                        height: 40, 
                        borderBottomWidth: 0.5, 
                        flex: 1, 
                        fontSize: 18}}
                         secureTextEntry
                         onChangeText={(val) => setNewPassword(val)}/>
                    </View>

                    <View style ={{flexDirection: 'row', marginTop:20}}>
                        <TextInput placeholder= "Re-type New Password" 
                        style = {{color: 'lightgrey',
                        paddingLeft: 20, 
                        height: 40, 
                        borderBottomWidth: 0.5, 
                        flex: 1, 
                        fontSize: 18}} 
                        secureTextEntry
                        onChangeText = {(val) => setConfirmPassword(val)}/>
                    </View>

                    <View style = {STYLES.buttonSignIn}>
                        <TouchableOpacity onPress={SignUpHandler}>
                            <Text style= {{color: 'white',fontWeight: "bold", fontSize: 18}}> 
                                Click To Become A Certified Pooper!
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

                    <Text style={{color: 'lightgrey', fontWeight: "bold"}}>Already have an account? </Text>
                    <TouchableOpacity onPress={()=> navigation.navigate('SignIn')}>
                        <Text style={{color: 'aqua', fontWeight: "bold"}}>SIGN IN</Text>
                    </TouchableOpacity>
                    
                </View>     
            </ScrollView>
        </SafeAreaView>


    );

}

export default SignUpScreen;