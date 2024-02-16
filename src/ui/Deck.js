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

  async Discard(hand, selected) {
    return await Api.discard(hand, selected, this.deckID);
  }
}
