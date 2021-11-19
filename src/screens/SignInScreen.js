import React from 'react';
import {StyleSheet,View,Text, SafeAreaView, ScrollView, TextInput,TouchableOpacity, Alert} from 'react-native';
import axios from 'axios';
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

    },
    textDanger: {
        color: "red"
    }

});



function SignInScreen({navigation}) {
    
    const {signIn} = React.useContext(AuthContext);
    const {enterAsGuest} = React.useContext(AuthContext);

    const [userData, setUserData] = React.useState(
        {username: "", userNameErrorMessage: "",
        password: "", passwordErrorMessage: "",}
    );

    // const login = {
    //     userData.username,
    //     userPassword
    // };

    // axios
    //     .post('/api/login', login)
    //     .then(() => console.log('Something happened'))
    //     .catch(err => {
    //         console.log(err)
    //     })





const formValidation = async () => {
    //Attempt at checking user input fields
    let errorFlag = false;
    let userNameLength = userData.username.length;
    let userErrorLength = userData.userNameErrorMessage.length;

    if(userNameLength === 0){ //Input is not empty validation
        errorFlag = true;
        setUserData({username: "", userNameErrorMessage: "Username is a required field!"});
    }else if(userData.username.trim().length > 20) { //Max input is 20 chars
        errorFlag = true;
        setUserData({username: "", userNameErrorMessage: "Can't be larger than 20 characters" });
    }

    if(userErrorLength === 0){//Input is not empty validation
        errorFlag = true;
        setUserData({password: "", passwordErrorMessage: "Password is a required field!"});

    }else if(userData.password.trim().length > 20) { //Max input is 20 chars
        errorFlag = true;
        setUserData({password: "", passwordErrorMessage: "Can't be larger than 20 characters"});
    }
    if(errorFlag){
        console.log("errorFlag");
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
                            onChangeText ={(val) => setUserData({username: val})} />
                            {userData.userNameErrorMessage.length > 0 && <Text style ={STYLES.textDanger}>{userData.userNameErrorMessage}</Text>}
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
                        onChangeText ={(val) => setUserData({password: val})}/>
                        {userData.passwordErrorMessage.length > 0 && <Text style={STYLES.textDanger}>{userData.passwordErrorMessage}</Text>}
                    </View>

                    <View style = {STYLES.buttonSignIn}>
                        <TouchableOpacity onPress={() => formValidation()}>
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