import fs from "fs-extra"


/////////////////////
//Initializing Game//
/////////////////////
let board = new Array(40).fill(0);
let overall = new Array(40).fill(0);
let space = 0;
//note these two will not be "landed" on if they move the player
let chanceSpaces = [2, 16, 32];
let cChestSpaces = [6, 21, 35];
//0-5 = nothing ; 6-7 = nearest transport ; 8 = nearest util ; 9 = back 3 spaces ; 10 = jail ;11 = istanbul ; 12 = railroad ; 13 = london ; 14 = go; 15 = montreal
let chanceDeck = [5, 7, 8, 9, 10, 11, 12, 13, 14, 15];
//0-13 = nothing ; 14 = advanced to go ; 15 = go to jail
let cChestDeck = [13, 14, 15];
let remainingChance = 16;
let remainingChest = 16;
let tPort = [4, 14, 24, 34];
let util = [ 11, 27];
let doublesCount = 0;
let totalDoublesBcImCurious = 0;

/////////////////
//configurables//
/////////////////
let games = process.argv[2] || 1000000; 
let turns = process.argv[3] || 100;
//expect random distribution
let expected = games * turns / 40;
let jailOn = true;
let chanceOn = true;
let cChestOn = true;

for (let j = 0; j < games; j++) {
	//init game instance variables
	let jailTurn = 0;
	let inJail = false;
	let gameChanceDeck = [...chanceDeck];
	let gameChestDeck = [...cChestDeck];
	if (j % (games / 1000) === 0) {
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		process.stdout.write(`${(j * 100) / games}% complete`);
		//console.log(`${j*100/games}% complete`)
	}

	for (let i = 0; i < turns; i++) {
		//one game with ival rolls
		let d1 = rollDie();
		let d2 = rollDie();
		//console.log(d1 + " " + d2);
		////////
		//Jail//
		////////
		if (inJail) {
			if (d1 === d2) {
				totalDoublesBcImCurious++;
				inJail = false;
				jailTurn = 0;
			} else if (jailTurn > 1) {
				jailTurn = 0;
				inJail = false;
			} else {
				jailTurn++;
				continue; //stay in jail
			}
		} else {
			//check for speeding
			if (d1 === d2) {
				totalDoublesBcImCurious++;
				i--; //roll again
				doublesCount++;
				if (doublesCount === 2) {
					//console.log("SPEEDING!!!")
					//go straight to jail
					space = 9;
					inJail = true;
					continue;
				}
			} else {
				doublesCount = 0;
			}
		}
		space += d1 + d2;
		if (space >= 40) {
			space -= 40;
		}
		//log before event sends you elsewhere
		board[space]++;

		//////////////////
		//land on chance//
		//////////////////
		if (chanceSpaces.includes(space) && chanceOn) {
			if (remainingChance === 0) {
				// shuffle deck
				gameChanceDeck = { ...chanceDeck };
				remainingChance = 16;
			}
			let card = Math.floor(Math.random() * remainingChance);
			remainingChance--;
			switch (true) {
				case card <= gameChanceDeck[0]: // nothing
					updateDeck(gameChanceDeck, 0);
					break;
				case card <= gameChanceDeck[1]: // nearest transport
					space = nearest(space, tPort);
					board[space]++;
					updateDeck(gameChanceDeck, 1);
					break;
				case card <= gameChanceDeck[2]: // nearest util
					space = nearest(space, util);
					board[space]++;
					updateDeck(gameChanceDeck, 2);
					break;
				case card <= gameChanceDeck[3]: // back 3 spaces
					space -= 3;
					board[space]++;
					updateDeck(gameChanceDeck, 3);
					break;
				case card <= gameChanceDeck[4]: // jail
					space = 9;
					inJail = true;
					updateDeck(gameChanceDeck, 4);
					break;
				case card <= gameChanceDeck[5]: // istanbul
					space = 10;
					board[space]++;
					updateDeck(gameChanceDeck, 5);
					break;
				case card <= gameChanceDeck[6]: // railroad
					space = 4;
					board[space]++;
					updateDeck(gameChanceDeck, 6);
					break;
				case card <= gameChanceDeck[7]: // london
					space = 23;
					board[space]++;
					updateDeck(gameChanceDeck, 7);
					break;
				case card <= gameChanceDeck[8]: // go
					space = 0;
					board[space]++;
					updateDeck(gameChanceDeck, 8);
					break;
				case card <= gameChanceDeck[9]: // montreal
					space = 39;
					board[space]++;
					updateDeck(gameChanceDeck, 9);
					break;
			}
		}

		///////////////////////////
		//land On Community Chest//
		///////////////////////////
		if (cChestSpaces.includes(space) && cChestOn) {
			if (remainingChest === 0) {
				gameChestDeck = { ...cChestDeck };
				remainingChest = 16;
			}
			let card = Math.floor(Math.random() * remainingChest);
			remainingChest--;
			switch (true) {
				case card <= gameChestDeck[0]: // nothing
					updateDeck(gameChestDeck, 0);
					break;
				case card <= gameChestDeck[1]: // advanced to go
					space = 0;
					board[space]++;
					updateDeck(gameChestDeck, 1);
					break;
				case card <= gameChestDeck[2]: // jail
					space = 9;
					inJail = true;
					updateDeck(gameChestDeck, 2);
					break;
			}
		}
		////////////////
		//land On Jail//
		////////////////
		if (jailOn) {
			if (space === 19) {
				inJail === true;
				space = 9;
			}
		}
	}

	//post p[rocessing]
	for (let i = 0; i < board.length; i++) {
		overall[i] += board[i];
	}
	board.fill(0);
	space = 0;
}

//////////
//Output//
//////////
let output = overall.map((space) => {
	return Math.pow(space - expected, 2);
});
console.log(totalDoublesBcImCurious);
let stdDev = Math.sqrt(sum(output) / (expected * 40));
let mean = sum(overall) / overall.length;
//slightly innaccurate because I sometimes record 2 squares for 1 roll.
console.log(`coeficient of Variance: ${stdDev / mean}`);
console.log(JSON.stringify(overall).replaceAll(",", " "));

let spaceNames = [
	"Go",
	'Mediterranean Avenue',
	'Community Chest',
	'Baltic Avenue',
	'Income Tax',
	'Reading Railroad',
	'Oriental Avenue',
	'Chance',
	'Vermont Avenue',
	'Connecticut Avenue',
	'Jail / Just Visiting',
	'St. Charles Place',
	'Electric Company',
	'States Avenue',
	'Virginia Avenue',
	'Pennsylvania Railroad',
	'St. James Place',
	'Community Chest',
	'Tennessee Avenue',
	'New York Avenue',
	'Free Parking',
	'Kentucky Avenue',
	'Chance',
	'Indiana Avenue',
	'Illinois Avenue',
	'B. & O. Railroad',
	'Atlantic Avenue',
	'Ventnor Avenue',
	'Water Works',
	"Marvin Gardens",
	'Go To Jail',
	'Pacific Avenue',
	'North Carolina Avenue',
	'Community Chest',
	'Pennsylvania Avenue',
	'Short Line',
	'Chance',
	'Park Place',
	'Luxury Tax',
	'Boardwalk',
]
let individualSpaceLandings = [];
for(let i = 0; i < overall.length; i++){
	individualSpaceLandings.push({space_name: spaceNames[i], count: overall[i]})
}

fs.writeFileSync("./data.json", JSON.stringify(individualSpaceLandings))


//fair die
function rollDie() {
	return Math.floor(Math.random() * 6) + 1;
}

//general function for summing an integer array
function sum(arr){
  return arr.reduce((accumulator, value) => {
	return accumulator + value;
  }, 0);
}

//for finding neares transport/utility array
function nearest(curPos, spaces){
  for (let i = 0; i < spaces.length; i++) {
		if (curPos < spaces[i]) {
			return spaces[i];
		}
	}
  //default
  return spaces[0];
}

//convoluted, but efficient deck tracking
function updateDeck(deck, index){
  for(let i = index; i< deck.length; i++){
    if(deck[i]!=-1){
      if(i===0){
      deck[0]-=1;
      } else { 
        deck[i]-=1
        if(deck[i]===deck[i-1]){
          //empty
          deck[i] = -1;
        }
      }
    }
  }
}

function badDie(){
  let rand = Math.random*28;
  switch (true) {
		case 0 <= rand && rand <= 4:
      return 1;
			break;
		case 4 <= rand && rand <= 8:
      return 2;
			break;
		case 8 <= rand && rand <= 12:
      return 3;
			break;
		case 12 <= rand && rand <= 16:
      return 4;
			break;
		case 16 <= rand && rand <= 20:
      return 5;
			break;
		case 24 <= rand && rand <= 28:
      return 6;
			break;
	}
}