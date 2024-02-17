import Api from "./Api.js";
import Hand from "./Hand.js";
import { useState, useCallback } from "react";

export default class Deck {
  static async create() {
    const ID = await Api.deck(); // create the deck on the server and get the id
    console.log(ID.message);
    return new Deck(ID.message);
  }

  constructor(ID) {
    this.deckID = ID;
  }

  async getDeck() {
    return this.deckID;
  }

  async deal(count) {
    return await Api.dealV2(this.deckID, count);
  }

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

  async discard(hand, selected, newGame) {
    if (newGame) {
      console.log(this.deckID);
      const cards = await this.strRepCards(hand, [0, 1, 2, 3, 4]);
      console.log(cards);
      return await Api.discard(this.deckID, cards);
    }
    console.log(this.deckID);
    const cards = await this.strRepCards(hand, selected);
    return await Api.discard(this.deckID, cards);
  }
}
