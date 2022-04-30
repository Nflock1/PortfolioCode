import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import {useState} from 'react';
import styles from '../styles.js'
//import axios from '../axios';

export default function Tile(props) {
    const [userText, setUserText] = useState('');
    const [passText, setPassText] = useState('');
    const [output, setOutput] = useState('Output will display here');

    function submit() {
        if(props.call == "register"){
            let req = {username: userText, password: passText}; 
            console.log(JSON.stringify(req));
            axios
             .post('/api/register', req)
             .then((res) => setOutput(res.message))
             .catch((res) => setOutput(res.message))
        }
        
    }

    
    function getInputA(event){
        setUserText(event.target.value);
    }

    function getInputB(event){
        setPassText(event.target.value);
    }
 
    return (
        <View style = {styles.tile}>
            <Text style ={styles.header}>Regsiter</Text>
            <View>
                <Text style = {{textAlign: 'center'}}>input a username or password that isnt already in use and click submit</Text>
            </View>
            
            <View><TextInput placeholder = "username" onChange = {getInputA}/></View>
            <View><TextInput placeholder = "password" onChange = {getInputB}/></View>

            <View>
                <Button title="submit" onPress={submit}/>
            </View>
            <View>
                <Text style = {{fontWeight: "bold", textAlign:'center', margin:10}}>{props.out}</Text>
            </View>
        </View>
    );
}

