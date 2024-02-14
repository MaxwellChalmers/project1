import Api from "./Api.js";

class Deck(){
	constructor(deckCode){
	
	 static async newDeck = await().Api.Deck(deckCode);
	 this.Deck = newDeck

	}

}