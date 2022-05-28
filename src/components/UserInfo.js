import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { useState } from "react";
import styles from "../styles.js";
import axios from "../axios";
import * as SecureStore from "expo-secure-store";

export default function infoTile(props) {
	let username = null;
	let token = null;
	let favorites = [];
	let history = [];

	if (props.info) {
		if (props.info) {
			if (props.info.data.username) {
				username = props.info.data.username;
			}
			if (props.info.token) {
				token = props.info.token;
			}
			if (props.info.data.favorites) {
				favorites = props.info.data.favorites;
			}
			if (props.info.data.history) {
				history = props.info.data.history;
			}
		}
	}
	let favs = "";
	for (let i = 0; i < favorites.length; i++) {
		i < favorites.length - 1 ? (favs = favs + favorites[i] + ", ") : (favs = favs + favorites[i]);
	}

	return (
		<View style={styles.tile}>
			<Text style={styles.header}>User Info</Text>
			<View>
				<Text>Username: </Text>
				<Text style={{ fontWeight: "bold", textAlign: "center", margin: 10 }}>{username}</Text>
			</View>
			<View>
				<Text>Token: </Text>
				<Text style={{ fontWeight: "bold", textAlign: "center", margin: 10 }}>{token}</Text>
			</View>
			<View>
				<View>
					<Text>User Data</Text>
				</View>
				<View>
					<Text>Favorites</Text>
					<Text style={{ fontWeight: "bold", textAlign: "center", margin: 10 }}>{favs}</Text>
				</View>
				<View>
					<Text>History</Text>
					<Text style={{ fontWeight: "bold", textAlign: "center", margin: 10 }}>{history}</Text>
				</View>
			</View>
		</View>
	);
}

/* export async function collect() { 
    let token = await SecureStore.getItemAsync('token');
    console.log("token in collect: " + token);
    let res = await axios.get('/api/userData', {headers: {'x-access-token': token}});
    return res.data.data
    //return "test";    
} */

//no real reason to have this function be here and not in the app.js \_('-')_/
export async function collect() {
	return SecureStore.getItemAsync("token").then((token) => {
		return axios.get("/api/userData", { headers: { "x-access-token": token } }).then((res) => {
			return { token: token, data: res.data.data };
		});
	});

	//return "test";
}
