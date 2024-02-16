import Api from "./Api.js";
import Hand from "./Hand.js";
import { useState, useCallback } from "react";

export default class Deck {

static async create() {
  const ID = await Api.deck(); // create the deck on the server and get the id
  return new Deck(ID);
}  
constructor(ID) {
    this.deckID = ID;
}

  async getDeck() {
    return this.deckID;
  }

  async Deal() {
    return await Api.deal();
  }

  async dealV2(count) {
    return await Api.dealV2(this.deckID, count);
  }

  async Discard(hand, selected) {
    return await Api.discard(hand, selected, this.deckID);
  }
}
