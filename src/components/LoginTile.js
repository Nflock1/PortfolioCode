import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import {useState} from 'react';
import styles from '../styles.js'
import axios from '../axios';
import * as SecureStore from 'expo-secure-store';

async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

export default function Tile(props) {
    const [userText, setUserText] = useState('');
    const [passText, setPassText] = useState('');
    const [output, setOutput] = useState('Output will display here');
    async function submit() {
        let req = {username: userText, password: passText}; 
        await axios
             .post('/api/login', req)
             .catch((res) => setOutput(res.message))
             .then((res) => {
                if(res.status==200){
                    setOutput("Login was sucessful"); 
                    save('token', res.data.data);
                } else {
                    setOutput(res.data.message);
                }
              })
    }

    function getPassword(event){
        setUserText(event);
    }

    function getUsername(event){
        setPassText(event);
    }

    return (
        <View style = {styles.tile}>
            <Text style ={styles.header}>Login</Text>
            <View>
                <Text style = {{textAlign: 'center'}}>input a username or password that is registered and click submit</Text>
            </View>
            
            <View><TextInput placeholder = "username" onChangeText = {getPassword}/></View>
            <View><TextInput placeholder = "password" onChangeText = {getUsername}/></View>

            <View>
                <Button title="submit" onPress={submit}/>
            </View>
            <View>
                <Text style = {{fontWeight: "bold", textAlign:'center', margin:10}}>{output}</Text>
            </View>
        </View>
    );
}