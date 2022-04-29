import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
  import Tile from './components/Tile';
  import styles from './styles';

export default function App() {
  return (

    <View style={styles.safe}>
        <Tile out = 'output' call = 'register' instruct = 'input a username or password that isnt already in use and click submit' inputs = {['username', 'password']}></Tile>
    </View>
    

    
  );
}

