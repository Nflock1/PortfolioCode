const mongoose = require("mongoose");
const config = require("./migrationConfig.js")
async function main() {
	const schema = new mongoose.Schema({_id: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
			default: () => new mongoose.Types.ObjectId() // Example default if needed
		}},
		{ strict: false }
	);
	const changeModel = DB.model(config.collection, schema, config.collection);
	if (true) {
			let jUpdates = config.updates;
			let jQuery = config.query;
			let query = {};
			for (let j = 0; j < jQuery.length; j++) {
				if (jQuery[j].key === "*") {
					break;
				} else if (jQuery[j].key) {
					if (jQuery[j].value == "undefined") {
						query[jQuery[j].key] = undefined;
					} else {
						query[jQuery[j].key] = jQuery[j].value;
					}
				}
			}
			let badName =
				"THIS SHULD NEVVVVER BE A DB FEILD NAME EVER NEVER EVER 4EVER UNTILL NEEEVER FOREVER";			
			let docs = await changeModel.find(query);
			console.log(docs)
			if(docs.length == 0) {
				console.log("NO DOCUMENTS MATCHED QUERY")
			}
			for (let j = 0; j < docs.length; j++) {
				query = { _id: docs[j]._id };
				console.log(query);
				for (let i = 0; i < jUpdates.length; i++) {
					let update = {};
					let arrayRun = false;
					let oldSplit;
					let newSplit;
					let oldExist = 0;
					let oldVExist = 0;
					let newExist = 0;
					let newVExist = 0;
					if (jUpdates[i].oldName) {
						oldExist = 1;
						if (jUpdates[i].newName) {
							newExist = 2;
						}
						if (jUpdates[i].oldValue) {
							oldVExist = 4;
						}
						if (jUpdates[i].newValue) {
							newVExist = 8;
						}
					}
					let count = oldExist + newVExist + oldVExist + newExist;
					// console.log(count)
					if (count !== 0) {
						let old = jUpdates[i].oldName;
						if (jUpdates[i].oldName.includes("[]")) {
							oldSplit = old.replaceAll(".", "");
							oldSplit = oldSplit.split("$[]");
							arrayRun = true;
							let newf = jUpdates[i].newName;
							newSplit = newf.replaceAll(".", "");
							newSplit = newSplit.split("$[]");
						}
					}

					switch (count) {
						//this case has been tested
						case 1:
							//delete all fields with fieldname = $oldField
							query = { _id: docs[j]._id };
							//delete oldval
							if (arrayRun) {
								query[`${oldSplit[0]}.${badName}`] = null;
								console.log(query);
								update["$unset"] = {};
								update["$unset"][`${oldSplit[0]}.$.${oldSplit[1]}`] = "";
								let res = await changeModel.updateOne(query, update);
								if (res.modifiedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was sucessful`);
								} else if (res.matchedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was NOT sucessful`);
									console.log(`\tQUERY: \n\t${JSON.stringify(query)}`);
									console.log(`\tUPDATE: \n\t${JSON.stringify(update)}`);
								}
							} else {
								update["$unset"] = {};
								update["$unset"][`${jUpdates[i].oldName}`] = "";
								let res = await changeModel.updateOne(query, update);
								if (res.modifiedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was sucessful`);
								} else if (res.matchedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was NOT sucessful`);
									console.log(`\tQUERY: \n\t${JSON.stringify(query)}`);
									console.log(`\tUPDATE: \n\t${JSON.stringify(update)}`);
								}
							}
							break;
						case 9: // tested
							//replace old value with new value
							//NOTE: no implementation for updating every value of fields in array
							//      was created
							if (!arrayRun) {
								update["$set"] = {};
								update["$set"][`${jUpdates[i].oldName}`] = jUpdates[i].newValue;
								let res = await changeModel.updateOne(query, update);
								if (res.modifiedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was sucessful`);
								} else {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was NOT sucessful`);
									console.log(`\tQUERY: \n\t${JSON.stringify(query)}`);
									console.log(`\tUPDATE: \n\t${JSON.stringify(update)}`);
								}
							}
							break;
						case 13: //tested
							//replace old value with new value for old values that match
							//NOTE: no implementation for updating every value of fields in array
							//      was created
							if (!arrayRun) {
								query = { _id: docs[j]._id };
								query[`${jUpdates[i].oldName}`] = jUpdates[i].oldValue;
								update[jUpdates[i].oldName] = jUpdates[i].newValue;
								let res = await changeModel.updateOne(query, update);
								if (res.modifiedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was sucessful`);
								} else {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was NOT sucessful`);
									console.log(`\tQUERY: \n\t${JSON.stringify(query)}`);
									console.log(`\tUPDATE: \n\t${JSON.stringify(update)}`);
								}
							}
							break;
						case 5: //tested
							//delete all fields with fieldname = $oldField AND $fieldname = $oldValue
							query = { _id: docs[j]._id };
							if (arrayRun) {
								query[`${oldSplit[0]}.${oldSplit[1]}`] = jUpdates[i].oldValue;
								//delete oldval
								update["$unset"] = {};
								update["$unset"][`${oldSplit[0]}.$.${oldSplit[1]}`] = "";
								let res = await changeModel.updateOne(query, update);
								if (res.modifiedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was sucessful`);
								} else if (res.matchedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was NOT sucessful`);
									console.log(`\tQUERY: \n\t${JSON.stringify(query)}`);
									console.log(`\tUPDATE: \n\t${JSON.stringify(update)}`);
								}
							} else {
								query[`${jUpdates[i].oldName}`] = jUpdates[i].oldValue;

								update["$unset"] = {};
								update["$unset"][`${jUpdates[i].oldName}`] = "";
								let res = await changeModel.updateOne(query, update);
								if (res.modifiedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was sucessful`);
								} else if (res.matchedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was NOT sucessful`);
									console.log(`\tQUERY: \n\t${JSON.stringify(query)}`);
									console.log(`\tUPDATE: \n\t${JSON.stringify(update)}`);
								}
							}
							break;
						case 3: // tested
							//copy value from oldfield into new field
							if (arrayRun) {
								let exchangeIds = docs[j][`${oldSplit[0]}`];
								for (let k = 0; k < exchangeIds.length; k++) {
									query = { _id: docs[j]._id };
									query[`${newSplit[0]}.${newSplit[1]}`] = null;
									//set newname = newval
									update["$set"] = {};
									update["$set"][`${newSplit[0]}.$.${newSplit[1]}`] =
										docs[j][`${oldSplit[0]}`][k][`${oldSplit[1]}`];
									//delete oldval
									update["$unset"] = {};
									update["$unset"][`${oldSplit[0]}.$.${oldSplit[1]}`] = "";
									let res = await changeModel.updateOne(query, update);
									if (res.modifiedCount > 0) {
										console.log(`\nUpdate ${i + 1}/${jUpdates.length} was sucessful`);
									} else {
										console.log(`\nUpdate ${i + 1}/${jUpdates.length} was NOT sucessful`);
										console.log(`\tQUERY: \n\t${JSON.stringify(query)}`);
										console.log(`\tUPDATE: \n\t${JSON.stringify(update)}`);
									}
								}
							} else {
								update["$set"] = {};
								update["$set"][`${jUpdates[i].newName}`] = docs[j][`${jUpdates[i].oldName}`];
								update["$unset"] = {};
								update["$unset"][`${jUpdates[i].oldName}`] = "";
								//console.log(update);
								let res = await changeModel.updateOne(query, update);
								if (res.modifiedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was sucessful`);
								} else if (res.matchedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was NOT sucessful`);
									console.log(`\tQUERY: \n\t${JSON.stringify(query)}`);
									console.log(`\tUPDATE: \n\t${JSON.stringify(update)}`);
								}
							}
							break;
						case 11: //tested
							//delete oldName field and replace with newName field with newValue
							if (arrayRun) {
								let exchangeIds = docs[j][`${oldSplit[0]}`];
								for (let k = 0; k < exchangeIds.length; k++) {
									query = { _id: docs[j]._id };
									//find the array item with newfield not existing yet
									query[`${newSplit[0]}.${newSplit[1]}`] = null;
									update["$set"] = {};
									update["$set"][`${newSplit[0]}.$.${newSplit[1]}`] = jUpdates[i].newValue;
									update["$unset"] = {};
									update["$unset"][`${oldSplit[0]}.$.${oldSplit[1]}`] = "";
									let res = await changeModel.updateOne(query, update);
									if (res.modifiedCount > 0) {
										console.log(`\nUpdate ${i + 1}/${jUpdates.length} was sucessful`);
									} else {
										console.log(`\nUpdate ${i + 1}/${jUpdates.length} was NOT sucessful`);
										console.log(`\tQUERY: \n\t${JSON.stringify(query)}`);
										console.log(`\tUPDATE: \n\t${JSON.stringify(update)}`);
									}
								}
							} else {
								update["$set"] = {};
								update["$set"][`${jUpdates[i].newName}`] = jUpdates[i].newValue;
								update["$unset"] = {};
								update["$unset"][`${jUpdates[i].oldName}`] = docs[j][`${jUpdates[i].oldName}`];
								let res = await changeModel.updateOne(query, update);
								if (res.modifiedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was sucessful`);
								} else if (res.matchedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was NOT sucessful`);
									console.log(`\tQUERY: \n\t${JSON.stringify(query)}`);
									console.log(`\tUPDATE: \n\t${JSON.stringify(update)}`);
								}
							}
							break;
						case 7: //tested
							//replace oldField with values matchin oldValue with new field that has the same value
							if (arrayRun) {
								let exchangeIds = docs[j][`${oldSplit[0]}`];
								for (let k = 0; k < exchangeIds.length; k++) {
									query = { _id: docs[j]._id };
									query[`${newSplit[0]}.${newSplit[1]}`] = null;
									query[`${oldSplit[0]}.${oldSplit[1]}`] = jUpdates[i].oldValue;
									//set newname = newval
									update["$set"] = {};
									update["$set"][`${newSplit[0]}.$.${newSplit[1]}`] =
										docs[j][`${oldSplit[0]}`][k][`${oldSplit[1]}`];
									//delete oldval
									update["$unset"] = {};
									update["$unset"][`${oldSplit[0]}.$.${oldSplit[1]}`] = "";
									await changeModel.updateOne(query, update);
								}
							} else {
								query = { _id: docs[j]._id };
								query[`${jUpdates[i].oldName}`] = jUpdates[i].oldValue;

								update["$set"] = {};
								update["$set"][`${jUpdates[i].newName}`] = docs[j][`${jUpdates[i].oldName}`];
								update["$unset"] = {};
								update["$unset"][`${jUpdates[i].oldName}`] = "";
								//console.log(update);
								let res = await changeModel.updateOne(query, update);
								if (res.modifiedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was sucessful`);
								} else if (res.matchedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was NOT sucessful`);
									console.log(`\tQUERY: \n\t${JSON.stringify(query)}`);
									console.log(`\tUPDATE: \n\t${JSON.stringify(update)}`);
								}
							}
							break;
						case 15: //tested
							//for all matches to oldValue, old field ->  new field + new value
							if (arrayRun) {
								let exchangeIds = docs[j][`${oldSplit[0]}`];
								for (let k = 0; k < exchangeIds.length; k++) {
									query = { _id: docs[j]._id };
									query[`${oldSplit[0]}.${oldSplit[1]}`] = jUpdates[i].oldValue;
									//find the array item with newfield not existing yet
									query[`${newSplit[0]}.${newSplit[1]}`] = null;
									update["$set"] = {};
									update["$set"][`${newSplit[0]}.$.${newSplit[1]}`] = jUpdates[i].newValue;
									update["$unset"] = {};
									update["$unset"][`${oldSplit[0]}.$.${oldSplit[1]}`] = "";
									let res = await changeModel.updateOne(query, update);
									if (res.modifiedCount > 0) {
										console.log(`\nUpdate ${i + 1}/${jUpdates.length} was sucessful`);
									} else {
										console.log(`\nUpdate ${i + 1}/${jUpdates.length} was NOT sucessful`);
										console.log(`\tQUERY: \n\t${JSON.stringify(query)}`);
										console.log(`\tUPDATE: \n\t${JSON.stringify(update)}`);
									}
								}
							} else {
								query[`${jUpdates[i].oldName}`] = jUpdates[i].oldValue;
								update["$set"] = {};
								update["$set"][`${jUpdates[i].newName}`] = jUpdates[i].newValue;
								update["$unset"] = {};
								update["$unset"][`${jUpdates[i].oldName}`] = docs[j][`${jUpdates[i].oldName}`];
								let res = await changeModel.updateOne(query, update);
								if (res.modifiedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was sucessful`);
								} else if (res.matchedCount > 0) {
									console.log(`\nUpdate ${i + 1}/${jUpdates.length} was NOT sucessful`);
									console.log(`\tQUERY: \n\t${JSON.stringify(query)}`);
									console.log(`\tUPDATE: \n\t${JSON.stringify(update)}`);
								}
							}
							break;
						default:
							//do nothing
							break;
					}
				}
				console.log(
					`~~~~~~~~~~~~~~~~~~~~~~~~~~~\nobject ${j + 1}/${
						docs.length
					} has been updated\n~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
				);
			}
			console.log("==================\n==== ALL DONE ====\n==================");
			mongoose.disconnect()
		// });
	}
}
let clusterConnParts = config.clusterURL.split("?");
let connectionString = `${clusterConnParts[0]}/${config.databaseName}?${clusterConnParts[1]}`;
console.log(connectionString);
const DB = mongoose
	.createConnection(connectionString, {

    autoIndex: true,
	})
	.on("connected", async () => {
		console.log("connected");
		await main();
		return;
	});
