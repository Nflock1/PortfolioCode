import React, { useState } from "react";
import { Text, View, TextInput, Button } from "react-native";
import styles from "../styles.js";
import CheckBox from "expo-checkbox";

export default function FavoriteTile(props) {
	const [paySelect, setPay] = useState(false);
	const [handiSelect, setHandi] = useState(false);
	const [genderSelect, setGender] = useState(false);
	const [hygieneSelect, setHygiene] = useState(false);
	const [changingSelect, setChanging] = useState(false);
	const [name, setName] = useState(null);
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

	function submit() {}

	return (
		<View style={styles.tile}>
			<Text style={styles.header}>Manage Favorites</Text>
			<View>
				<Text style={{ textAlign: "center" }}> Add Restruant </Text>
			</View>
			<View>
				<TextInput placeholder="Name of Restroom" onChangeText={getName} />
			</View>
			<View>
				<TextInput placeholder="Description" onChangeText={getDescription} />
			</View>
			<View>
				<TextInput placeholder="Address" onChangeText={getAddress} />
			</View>
			<View>
				<TextInput placeholder="Lattitude" onChangeText={getLat} />
			</View>
			<View>
				<TextInput placeholder="Longitude" onChangeText={getLong} />
			</View>
			<View>
				<Text style={{ textAlign: "center" }}>The Fields below are on a scale of 0 to 5</Text>
			</View>
			<View>
				<TextInput placeholder="Cleanliness" onChangeText={getClean} />
			</View>
			<View>
				<TextInput placeholder="Smell" onChangeText={getSmell} />
			</View>
			<View>
				<TextInput placeholder="Toilet Paper Quality" onChangeText={getTP} />
			</View>
			<View>
				<TextInput placeholder="Safety of Restroom/Area" onChangeText={getSafe} />
			</View>
			<View>
				<TextInput placeholder="Privacy of Restroom" onChangeText={getPrivacy} />
			</View>
			<View>
				<TextInput placeholder="Busyness of Restroom" onChangeText={getBusy} />
			</View>
			<View>
				<Text>Did you have to pay to use it?</Text>
				<CheckBox value={paySelect} onValueChange={setPay} />
			</View>
			<View>
				<Text>Was it handicap accesible?</Text>
				<CheckBox value={handiSelect} onValueChange={setHandi} />
			</View>
			<View>
				<Text>Was there a gender neutral option?</Text>
				<CheckBox value={genderSelect} onValueChange={setGender} />
			</View>
			<View>
				<Text>Were there hygiene products available?</Text>
				<CheckBox value={hygieneSelect} onValueChange={setHygiene} />
			</View>
			<View>
				<Text>Was there an infant changing station?</Text>
				<CheckBox value={changingSelect} onValueChange={setChanging} />
			</View>

			<View>
				<Button title="submit" onPress={submit} />
			</View>
			<View>
				<Text style={{ fontWeight: "bold", textAlign: "center", margin: 10 }}>{"output"}</Text>
			</View>
		</View>
	);
}
