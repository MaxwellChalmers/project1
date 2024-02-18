import { React, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import Api from "./Api.js";
import App from "./App.js";
import Deck from "./Deck.js";

async function main() {
  const deck = await Deck.create();
  let initialCards = await deck.deal(5);
  const rank = await deck.highestRank(initialCards);

  // create React elements
  const root = createRoot(document.getElementById("app"));
  root.render(
    <App initialCards={initialCards} fetchedDeck={deck} initialRank={rank} />
  );
}

window.onload = main;
