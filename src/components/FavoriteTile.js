import styles from "../styles";
import { Text, View, TextInput, Button } from "react-native";
import React, { useState } from "react";
import axios from "../axios";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../context";

async function load(key) {
	return await SecureStore.getItemAsync(key);
}

export default function FavoriteTile(props) {
	const { userInfo } = React.useContext(AuthContext);
	const [favName, setFavName] = useState(null);
	const [rmName, setRmName] = useState(null);
	const [output, setOutput] = useState("output for adding a favorite will display here");
	const [rmOutput, setRmOutput] = useState("output for removing a favorite will display here");
	async function submit() {
		if (!props.loggedIn) {
			setOutput("Please log in and try again");
			return;
		}
		let res = await axios.get(
			"/api/get-RR",
			{
				headers: { "x-access-token": await load("token") },
			},
			favName
		);
		if (res.status == 298) {
			setOutput(res.data.message);
			return;
		}
		let req = props.info.data;
		if (req.favorites.includes(favName)) {
			setOutput("You already have that restroom favorited");
			return;
		}
		req.favorites.push(favName);
		axios
			.post("/api/update-userData", req, { headers: { "x-access-token": await load("token") } })
			.catch((err) => {
				setOutput(err.message);
			})
			.then((res) => {
				userInfo();
				setOutput(res.data.message);
			});
	}
	async function rmSubmit() {
		if (!props.loggedIn) {
			setRmOutput("Please log in and try again");
			return;
		}
		let req = props.info.data;
		if (!req.favorites.includes(favName)) {
			setRmOutput("You do not have this restroom in your favorites");
			return;
		}
		req.favorites.splice(req.favorites.indexOf(favName), 1);
		axios
			.post("/api/update-userData", req, { headers: { "x-access-token": await load("token") } })
			.catch((err) => {
				setRmOutput(err.message);
			})
			.then((res) => {
				userInfo();
				setRmOutput(res.data.message);
			});
	}

	return (
		<View style={styles.tile}>
			<Text style={[styles.header, { paddingBottom: 5 }]}>Manage Favorites</Text>
			<Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 14 }}>
				Add New Favorite
			</Text>
			<TextInput
				placeholder="Name of restroom to add"
				onChangeText={(text) => setFavName(text)}
				style={[styles.textBox, { marginTop: 5 }]}
			/>
			<View style={{ marginTop: 10 }}>
				<Button title="submit" onPress={submit} />
			</View>
			<Text style={{ fontWeight: "bold", textAlign: "center", marginTop: 10 }}>{output}</Text>

			<Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 14 }}>Remove Favorite</Text>
			<TextInput
				placeholder="Name of restroom to remove"
				onChangeText={(text) => setRmName(text)}
				style={[styles.textBox, { marginTop: 5 }]}
			/>
			<View style={{ marginTop: 10 }}>
				<Button title="submit" onPress={rmSubmit} />
			</View>
			<Text style={{ fontWeight: "bold", textAlign: "center", marginTop: 10 }}>{rmOutput}</Text>
		</View>
	);
}
