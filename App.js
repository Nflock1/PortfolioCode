import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
  import RegisterTile from './components/RegisterTile';
  import styles from './styles';

export default function App() {
  return (

    <View style={styles.safe}>
        <RegisterTile></RegisterTile>
    </View>
    

    
  );
}

