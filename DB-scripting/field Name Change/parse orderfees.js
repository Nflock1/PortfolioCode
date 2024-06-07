import mongoose from "mongoose";

let connURL =
	"mongodb+srv://appuser:wMenLn6g6yanHpuv@cluster0.cvnqi5i.mongodb.net/IRAF-Trading-Dev?retryWrites=true&w=majority";
//let connURL = `mongodb+srv://sysTrader:7O16GdxUrRWCTU5a@cluster01.9yvei.mongodb.net/IRAF-Trading-Dev?retryWrites=true&w=majority`;
const DB = mongoose
	.createConnection(connURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		autoIndex: true,
	})
	.on("connected", async () => {
		console.log("connected");
		await main();
		return;
	});

const model = new mongoose.Schema({}, { strict: false });
const model2 = new mongoose.Schema({}, { strict: false });
let Orders = DB.model("orders", model);
let TradeUsers = DB.model("tradeusers", model2);

async function main() {
	//find all tradeUsers that have apiKey Auth
	let antiSegUsers = await TradeUsers.find({ "exchangeIds.exchangeAuth": "APIKey" });
	//antiSegUsers = await TradeUsers.find({ clientAccountId: "trading-test-dev" });
	for (let i = 0; i < antiSegUsers.length; i++) {
		//filter out APIKey auth methods form those users
		let exchangeIds = antiSegUsers[i].exchangeIds.filter((id) => id.exchangeAuth == "APIKey");
		for (let j = 0; j < exchangeIds.length; j++) {
			//find all orders related to that user's exchange account Id
			let query = {
				clientAccountId: antiSegUsers[i].clientAccountId,
				exchangeAccountId: exchangeIds[j].exchangeAccountId,
				exchange: exchangeIds[j].exchange,
				type: "tradeOrder",
			};
			if (exchangeIds[j].exchangeAuth != "APIKey") {
				console.log(`EXCHANGE AUTH IS: (${exchangeIds[j].exchangeAuth})`);
			}
			let updateOrders = await Orders.find(query);
			//update all those order's fees to be 0
			console.log(
				`found ${updateOrders.length} orders for APIKey user. clientAccountId: (${antiSegUsers[i].clientAccountId}), exchangeAccountId: (${exchangeIds[j].exchangeAccountId})`
			);
			for (let k = 0; k < updateOrders.length; k++) {
				let newOrder = await Orders.findOneAndUpdate(
					{ _id: updateOrders[k]._id },
					{
						$set: {
							"fee.svcTransferCost": 0,
							"fee.svcTransferRate": 0,
							"fee.svcFulfilled": true,
							"fee.svcRate": updateOrders[k].fee.rate,
							"fee.svcCost": updateOrders[k].fee.cost,
							"fee.svcFulfilledTtf": true,
						},
					},
					{ new: true }
				);
				if (newOrder?.fee?.svcTransferCost > 0) {
					console.log("failed");
				} else {
					//	console.log(newOrder.fee.svcTransferCost);
				}
			}
			console.log(`finished removing fees from ${updateOrders.length} orders`);
		}
	}

	// let allOrders = await Orders.find({ "fee.svcTransferCost": { $gt: 0 } });
	// for (let i = 0; i < allOrders.length; i++) {
	// 	let user = await TradeUsers.findOne({ clientAccountId: allOrders[i].clientAccountId });
	// 	console.log(user.exchangeIds);
	// 	console.log(allOrders[i].exchange + " : " + allOrders[i].exchangeAccountId);
	// 	let exchId = user.exchangeIds.find(
	// 		(id) =>
	// 			id.exchangeAccountId == allOrders[i].exchangeAccountId &&
	// 			id.exchange == allOrders[i].exchange
	// 	);
	// 	console.log(exchId);
	// 	if (exchId.exchangeAuth != "OAuth") {
	// 		await Orders.findOneAndUpdate(
	// 			{ _id: allOrders[i]._id },
	// 			{ $set: { "fee.svcTransferCost": 0 } }
	// 		);
	// 	}
	// }
}
//main();
