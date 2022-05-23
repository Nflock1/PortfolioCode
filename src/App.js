import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RegisterTile from './components/RegisterTile';
import styles from './styles';
import LoginTile from './components/LoginTile';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from './context';
import React, { useMemo } from 'react';

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

export default function App() {

  const[userToken, setUserToken] = React.useState(null);

  const authCtx = React.useMemo(() => {
    return {
      register: () => {
      },
      login: () => {
        load('token').then((res) => {setUserToken(res)})
      },
      logout: () => {
        setUserToken(null);
      }
    }
  })
  
  
  return (
    <AuthContext.Provider value = {authCtx}>
      <View style={styles.safe}>
          <RegisterTile loggedIn = {userToken ? true : false}></RegisterTile>
          <LoginTile loggedIn = {userToken ? true : false}></LoginTile>
      </View>
    </AuthContext.Provider>
  );
}

