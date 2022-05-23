import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import {useState} from 'react';
import styles from '../styles.js'
import axios from '../axios';
import * as SecureStore from 'expo-secure-store';

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function load(key) {
    return await SecureStore.getItemAsync(key);
}

export default function Tile(props) {
    const [userText, setUserText] = useState('');
    const [passText, setPassText] = useState('');
    const [output, setOutput] = useState('Output will display here');

    async function submit() {       
        let req = {username: userText, password: passText}; 

        /* let reg = await axios
         .post('/api/register', req)
         .catch((res) => console.log(JSON.stringify(res)))
        let decide;
        (reg == undefined) ? decide = false : (reg.status==200) ? decide = true : decide = false
        if(decide){
            await axios
             .post('/api/login', req)
             .catch((res) => setOutput(res.message))
             .then((res) => {
                if(res.status==200){
                    setOutput("User creation sucessful and user has been logged in"); 
                    save('token', res.data.data);
                } else {
                    setOutput(res.data.message);
                }
              })
        } else { 
            setOutput(reg.data.message)
        } */


        await axios
         .post('/api/register', req)
         .catch((response) => console.log(JSON.stringify(response)))
         .then(async () => {
            await axios
                .post('/api/login', req)
                .catch((res) => setOutput(res.message))
                .then( (res) => {
                   if(res.status==200){
                       setOutput("User creation sucessful and user has been logged in"); 
                       save('token', res.data.data);
                   } else {
                       setOutput(res.data.message);
                   }
                 })
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
            <Text style ={styles.header}>Register</Text>
            <View>
                <Text style = {{textAlign: 'center'}}>input a username or password that isnt already in use and click submit</Text>
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

