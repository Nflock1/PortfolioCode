import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import styles from "./styles";
import RegisterTile from "./components/RegisterTile";
import OptionsTile from "./components/OptionsTile";
import LoginTile from "./components/LoginTile";
import UserInfo from "./components/UserInfo";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "./context";
import React, { useMemo } from "react";
import { collect } from "./components/UserInfo";
import FavoriteTile from "./components/FavoritesTile";

async function save(key, value) {
	await SecureStore.setItemAsync(key, value);
}

export default function App() {
	const [userInfo, setUserInfo] = React.useState(null);
	const [userToken, setUserToken] = React.useState(null);

	const authCtx = React.useMemo(() => {
		return {
			login: (token) => {
				save("token", token).then(() => {
					setUserToken(token);
				});
				collect().then((res) => {
					setUserInfo(res);
				});
			},
			logout: () => {
				setUserToken(null);
				setUserInfo(null);
			},
		};
	});

	return (
		<AuthContext.Provider value={authCtx}>
			<ScrollView style={styles.safe}>
				<UserInfo info={userInfo ? userInfo : null}></UserInfo>
				<OptionsTile loggedIn={userToken ? true : false}></OptionsTile>
				<RegisterTile loggedIn={userToken ? true : false}></RegisterTile>
				<LoginTile loggedIn={userToken ? true : false}></LoginTile>
				<FavoriteTile loggedIn={userToken ? true : false}></FavoriteTile>
			</ScrollView>
		</AuthContext.Provider>
	);
}
