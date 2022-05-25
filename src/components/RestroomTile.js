import React, { useState } from "react";
import { Text, View, TextInput, Button } from "react-native";
import styles from "../styles.js";
import CheckBox from "expo-checkbox";
import axios from "../axios";
import * as SecureStore from "expo-secure-store";

async function load(key) {
	return await SecureStore.getItemAsync(key);
}

export default function RestroomTile(props) {
	const [output, setOutput] = useState("output for restroom creation will display here");
	const [rmOutput, setRmOutput] = useState("output for restroom removal will display here");
	const [name, setName] = useState(null);
	const [delName, setDelName] = useState(null);
	const [description, setDescription] = useState(null);
	const [address, setAddress] = useState(null);
	const [lat, setLat] = useState(null);
	const [long, setLong] = useState(null);
	const [clean, setClean] = useState(null);
	const [smell, setSmell] = useState(null);
	const [TP, setTP] = useState(null);
	const [safe, setSafe] = useState(null);
	const [privacy, setPrivacy] = useState(null);
	const [busy, setBusy] = useState(null);

	function getName(event) {
		setName(event);
	}
	function getDescription(event) {
		setDescription(event);
	}
	function getAddress(event) {
		setAddress(event);
	}
	function getLat(event) {
		setLat(event);
	}
	function getLong(event) {
		setLong(event);
	}

	async function submit() {
		if (!props.loggedIn) {
			setOutput("please log in and try again");
			return;
		}

		axios
			.post(
				"/api/new-RR",
				{ name: name, description: description, address: address, longitude: long, latitude: lat },
				{ headers: { "x-access-token": await load("token") } }
			)
			.catch((err) => {
				setOutput(err.message);
			})
			.then((res) => {
				setOutput(res.data.message);
			});
	}

	async function rmSubmit() {
		if (!props.loggedIn) {
			setRmOutput("please log in and try again");
			return;
		}
		console.log(delName);
		axios
			.delete("/api/rm-RR", {
				headers: { "x-access-token": await load("token") },
				data: { name: delName },
			})
			.catch((err) => {
				setRmOutput(err.message);
			})
			.then((res) => {
				setRmOutput(res.data.message);
			});
	}

	return (
		<View style={styles.tile}>
			<Text style={styles.header}>Manage Restrooms</Text>
			<Text style={{ textAlign: "center", marginTop: 5, fontWeight: "bold", fontSize: 16 }}>
				Add Restroom
			</Text>
			<TextInput
				placeholder="Name of Restroom (Required)"
				onChangeText={getName}
				style={styles.textBox}
			/>
			<TextInput placeholder="Description" onChangeText={getDescription} style={styles.textBox} />
			<TextInput
				placeholder="Address (Required)"
				onChangeText={getAddress}
				style={styles.textBox}
			/>
			<TextInput placeholder="Lattitude (Required)" onChangeText={getLat} style={styles.textBox} />
			<TextInput placeholder="Longitude (Required)" onChangeText={getLong} style={styles.textBox} />
			<View style={{ marginTop: 5 }}>
				<Button title="submit" onPress={submit} />
			</View>
			<View>
				<Text style={{ fontWeight: "bold", textAlign: "center", marginTop: 10 }}>{output}</Text>
			</View>
			<Text style={{ textAlign: "center", marginTop: 5, fontWeight: "bold", fontSize: 16 }}>
				Remove Restroom
			</Text>
			<TextInput
				placeholder="Name of Restroom"
				onChangeText={setDelName}
				style={[styles.textBox, { marginTop: 5 }]}
			/>
			<View style={{ marginTop: 10 }}>
				<Button title="submit" onPress={rmSubmit} />
			</View>
			<Text style={{ fontWeight: "bold", textAlign: "center", marginTop: 10 }}>{rmOutput}</Text>
		</View>
	);
}

{
	/*
  const [paySelect, setPay] = useState(false);
	const [handiSelect, setHandi] = useState(false);
	const [genderSelect, setGender] = useState(false);
	const [hygieneSelect, setHygiene] = useState(false);
	const [changingSelect, setChanging] = useState(false);

  function getClean(event) {
		setClean(event);
	}
	function getSmell(event) {
		setSmell(event);
	}
	function getTP(event) {
		setTP(event);
	}
	function getSafe(event) {
		setSafe(event);
	}
	function getPrivacy(event) {
		setPrivacy(event);
	}
	function getBusy(event) {
		setBusy(event);
	}
  
  <Text style={{ textAlign: "center", paddingLeft: 40, paddingRight: 40 }}>
				The Fields below are on a scale of 0 to 5
			</Text>
			<TextInput placeholder="Cleanliness" onChangeText={getClean} style={styles.textBox} />
			<TextInput placeholder="Smell" onChangeText={getSmell} style={styles.textBox} />
			<TextInput placeholder="Toilet Paper Quality" onChangeText={getTP} style={styles.textBox} />
			<TextInput
				placeholder="Safety of Restroom/Area"
				onChangeText={getSafe}
				style={styles.textBox}
			/>
			<TextInput
				placeholder="Privacy of Restroom"
				onChangeText={getPrivacy}
				style={styles.textBox}
			/>
			<TextInput placeholder="Busyness of Restroom" onChangeText={getBusy} style={styles.textBox} />
			<View style={styles.checkView}>
				<Text style={{ width: "90%" }}>Did you have to pay to use it?</Text>
				<CheckBox value={paySelect} onValueChange={setPay} style={styles.checkBox} />
			</View>
			<View style={styles.checkView}>
				<Text style={{ width: "90%" }}>Was it handicap accesible?</Text>
				<CheckBox value={handiSelect} onValueChange={setHandi} style={styles.checkBox} />
			</View>
			<View style={styles.checkView}>
				<Text style={{ width: "90%" }}>Was there a gender neutral option?</Text>
				<CheckBox value={genderSelect} onValueChange={setGender} style={styles.checkBox} />
			</View>
			<View style={styles.checkView}>
				<Text style={{ width: "90%" }}>Were there hygiene products available?</Text>
				<CheckBox value={hygieneSelect} onValueChange={setHygiene} style={styles.checkBox} />
			</View>
			<View style={styles.checkView}>
				<Text style={{ width: "90%" }}>Was there an infant changing station?</Text>
				<CheckBox value={changingSelect} onValueChange={setChanging} style={styles.checkBox} />
			</View> */
}
