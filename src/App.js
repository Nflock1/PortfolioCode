import React, { useEffect,useMemo } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import FavoriteScreen from './screens/FavoriteScreen';
import SubmissionScreen from './screens/SubmissonScreen';
import SplashScreen from './screens/SplashScreen'

import { AuthContext } from './context';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();





function App() {
  const[isLoading, setIsLoading] = React.useState(true);
  const[userToken, setUserToken] = React.useState(null);
  
  const authContext = React.useMemo( () => {
    return {
      signIn: () => {
        setIsLoading(false);
        setUserToken('asdf');
      },
      signUp: () => {
        setIsLoading(false);
        setUserToken('asdf');
      },
      signOut: () => {
        setIsLoading(false);
        setUserToken(null);
      },
      enterAsGuest: () => {
        setIsLoading(false);
        setUserToken('asdf');
      }
    }

  }, [])

  React.useEffect(() => {
    setTimeout(() => {

      setIsLoading(false);

    },1000)
  }, [])

  if(isLoading) {

    return <SplashScreen/>;

  }

  return (

   <AuthContext.Provider value = {authContext} >
   <NavigationContainer>
     {userToken ? (

      <Drawer.Navigator>

        <Drawer.Screen name = "Home" component = {HomeScreen}/>
        <Drawer.Screen name = "Favorites" component = {FavoriteScreen}/>
        <Drawer.Screen name = "Submit Restroom" component = {SubmissionScreen}/>

      </Drawer.Navigator>

     ) : (

        <Stack.Navigator>

          <Stack.Screen name = "SignIn" component = {SignInScreen} options={{ header: () => null }} />
          <Stack.Screen name = "Sign Up" component = {SignUpScreen} options={{ header: () => null }}/>

        </Stack.Navigator>


     )}

   </NavigationContainer>
   </AuthContext.Provider>
  );
}
export default App;


