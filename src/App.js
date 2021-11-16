import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import FavoriteScreen from './screens/FavoriteScreen';
import SubmissionScreen from './screens/SubmissonScreen';
// import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createNativeStackNavigator();

function App() {


  return (
   <NavigationContainer>
     <Stack.Navigator>

          <Stack.Screen name = "SignIn" component = {SignInScreen} options={{ header: () => null }} />
          <Stack.Screen name = "Sign Up" component = {SignUpScreen} options={{ header: () => null }}/>
                    
          <Stack.Screen name = "HomeScreen" component = {HomeScreen} options={{ header: () => null}}/>

          
          <Stack.Screen name = "FavoriteScreen" component = {FavoriteScreen} options={{ header: () => null}}/>
          <Stack.Screen name = "SubmissonScreen" component = {SubmissionScreen} options={{ header: () => null}}/>

     </Stack.Navigator>
   </NavigationContainer>
  );
}
export default App;
