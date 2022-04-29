import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import {useState} from 'react';
import styles from '../styles.js'
//import axios from '../axios';

export default function Tile(props) {
    // const [userText, setUserText] = useState('');
    // const [passText, setPassText] = useState('');
    // const [output, setOutput] = useState('Output will display here');

    // function submit() {
    //     let req = {username: userText, password: passText}; 
    //     console.log(userText+ "    " + passText);
    //     axios
    //      .post('/api/register', {username: userText, password: passText})
    //      .then((res) => setOutput(res.message))
    //      .catch((res) => setOutput(res.message));
    // }

    // function getInputA(event){
    //     setUserText(event.target.value);
    // }

    // function getInputB(event){
    //     setPassText(event.target.value);
    // }
    
    // const style1 = {padding: '1rem'};
    // const style2 = {align: 'center'};   style = {{...style1, ...style2}}
    


    return (
        <View style = {styles.tile}>
            <Text style ={styles.header}>{props.call}</Text>

            <View >
                <Text style = {{textAlign: 'center'}}>{props.instruct}</Text>
            </View>

                <View>
                    <TextInput placeholder = {inputs}/>
                </View>
            

            <View>
                <Button title="submit"/>
            </View>
            <View>
                <Text style = {{fontWeight: "bold", textAlign:'center', margin:10}}>{props.out}</Text>
            </View>
        </View>
    );
}

