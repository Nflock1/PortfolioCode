import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import {useState} from 'react';
import styles from '../styles.js'
//import axios from '../axios';

export default function Tile(props) {
    // const [userText, setUserText] = useState('');
    // const [passText, setPassText] = useState('');
    // const [output, setOutput] = useState('Output will display here');

    function submit() {
        if(props.call == "register"){
            let req = {username: this.refs.input1.value, password: this.refs.input2.value}; 
            console.log(JSON.stringify(req));
            axios
             .post('/api/register', req)
             .then((res) => setOutput(res.message))
             .catch((res) => setOutput(res.message));
        }
        
    }

    // function getInputA(event){
    //     setUserText(event.target.value);
    // }

    // function getInputB(event){
    //     setPassText(event.target.value);
    // }
    
    


    return (
        <View style = {styles.tile}>
            <Text style ={styles.header}>{props.call}</Text>
            <View>
                <Text style = {{textAlign: 'center'}}>{props.instruct}</Text>
            </View>
            {props.inputs.map((input,index) =>{
                return <View key = {index}><TextInput placeholder = {input} ref = {`input${index}`}/></View>
            })}
            <View>
                <Button title="submit" onPress={submit}/>
            </View>
            <View>
                <Text style = {{fontWeight: "bold", textAlign:'center', margin:10}}>{props.out}</Text>
            </View>
        </View>
    );
}

