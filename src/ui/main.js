import { React, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import Api from "./Api.js";
import App from "./App.js";
import Deck from "./Deck.js";

async function main() {
  const deck = await Deck.create();

  const d = await deck.getDeck();

  console.log(d);
  let initialCards = await deck.deal(5);
  console.log(initialCards);

  console.log(initialCards);

  // create React elements
  const root = createRoot(document.getElementById("app"));
  root.render(<App initialCards={initialCards} fetchedDeck={deck} />);
}

window.onload = main;
