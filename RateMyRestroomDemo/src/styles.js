import { StyleSheet, StatusBar } from "react-native";

export default styles = StyleSheet.create({
	safe: {
		paddingVertical: StatusBar.currentHeight,
	},

	header: {
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 20,
	},

	elevation: {
		elevation: 20,
		shadowColor: "#52006A",
	},

	tile: {
		backgroundColor: "green",
		borderRadius: 100,
		padding: 40,
		width: "80%",
		marginHorizontal: 10,
		textAlign: "center",
		marginTop:20
	},

	textBox: {
		borderColor: "#320505",
		borderWidth: 1,
		margin: "auto",
		paddingLeft: 5,
	},

	checkBox: {
		borderColor: "#320505",
		marginLeft: "auto",
	},

	checkView: {
		flex: 1,
		flexDirection: "row",
		marginTop: 2,
	},
});
