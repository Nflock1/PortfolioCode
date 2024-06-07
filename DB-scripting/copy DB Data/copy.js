
import mongoose from "mongoose";
import * as readline from "node:readline/promises";
import fs from 'fs'
modelPath = "~/V0.2/ttf-trade-app-backend/models"
async function main () {
  let rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	let modelName = await rl.question("what model to copy (case sensitive)?\n");
  let path = modelPath + modelName;
  copyModel = require(`${path}`)
	let copyModel = DB.model(modelName, model);
  let docList = copyModel.find({});
  for(let i = 0; i<docList.length; i++){
    doc = docList[i];
    let deepCopy = {
      tradeUserGroupId: doc.tradeUserGroupId,
      permissions: doc.permissions,
      exchangeIds: doc.exchangeIds,
      tutorialFlag: doc.tutorialFlag,
      avatar: doc.avatar,
      balances: doc.balances,
      favorites: doc.favorites,
      
    }
  }
}


let connURL = `mongodb+srv://sysTrader:7O16GdxUrRWCTU5a@cluster01.9yvei.mongodb.net/test?retryWrites=true&w=majority`;
const DB = mongoose
	.createConnection(connURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		autoIndex: true,
	})
	.on("connected", () => {
		console.log("connected");
		main();
	});
