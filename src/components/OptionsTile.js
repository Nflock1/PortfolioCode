import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { useState } from "react";
import styles from "../styles.js";
import { AuthContext } from "../context";
import React from "react";
import axios from "../axios.js";
import * as SecureStore from "expo-secure-store";

async function load(key) {
	return await SecureStore.getItemAsync(key);
}

export default function InteractTile(props) {
	const { logout } = React.useContext(AuthContext);
	const [output, setOutput] = useState("Output will display here");

	function logoutHandler() {
		if (!props.loggedIn) {
			setOutput("No user is currently logged in");
			return;
		}
		logout();
		setOutput("User has been logged out");
	}

	async function deleteHandler() {
		if (!props.loggedIn) {
			setOutput("No user is currently logged in");
			return;
		}
		axios
			.delete("/api/rm-user", { headers: { "x-access-token": await load("token") } })
			.catch((err) => {
				setOutput(err.message);
			})
			.then((res) => {
				if (res.status == 200) {
					setOutput("User sucessfully deleted");
					logout();
				} else {
					setOutput(res.data.message);
				}
			});
	}

	return (
		<View style={styles.tile}>
			<Text style={styles.header}>Options</Text>
			<View>
				<Button title="logout" onPress={logoutHandler} />
				<Button title="Delete Account" onPress={deleteHandler} />
			</View>
			<View>
				<Text style={{ fontWeight: "bold", textAlign: "center", margin: 10 }}>{output}</Text>
			</View>
		</View>
	);
}
