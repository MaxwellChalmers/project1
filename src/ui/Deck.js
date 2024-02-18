import Api from "./Api.js";
import Hand from "./Hand.js";
import { useState, useCallback } from "react";

export default class Deck {
  static async create() {
    const ID = await Api.deck(); // create the deck on the server and get the id
    return new Deck(ID.message);
  }

  constructor(ID) {
    this.deckID = ID;
  }
  //returns the deck ID
  async getDeck() {
    return this.deckID;
  }
  //deals count number of cards
  async deal(count) {
    return await Api.dealV2(this.deckID, count);
  }
  //converts a hand(an array of card objects) to a string in order to pass cards/hands to the backend
  async strRepCards(hand, selected) {
    if (selected.length === 0) {
      return "NONE";
    }
    let cardsString = "";
    for (let i = 0; i < selected.length; i++) {
      cardsString += hand[selected[i]].rank;
      cardsString += hand[selected[i]].suit;
    }
    return cardsString;
  }

  async highestRank(hand) {
    const cards = await this.strRepCards(hand, [0, 1, 2, 3, 4]);

    return await Api.highestRank(cards);
  }

  // sends cards to return to the backend deck
  async discard(hand, selected, newGame) {
    if (newGame) {
      const cards = await this.strRepCards(hand, [0, 1, 2, 3, 4]);
      return await Api.discard(this.deckID, cards);
    }

    const cards = await this.strRepCards(hand, selected);
    return await Api.discard(this.deckID, cards);
  }
}
