import Api from "./Api.js";
import Hand from "./Hand.js";
import Deck from "./Deck.js";
import DrawButton from "./DrawButton.js";
import { useState, useCallback } from "react";

export default function App({ initialCards, fetchedDeck }) {
  const [cards, setCards] = useState(initialCards); //the hand used by the app
  const [selected, setSelected] = useState([]); //tracker for card selection

  const [unselectedAcesCount, setUnselectedAcesCount] = useState(
    // maintains the number of aces in a hand that haven't been selected for discard
    numberOfUnselectedAces(cards)
  );
  const [newGame, setNewGame] = useState(false); // if true sets the app to function for a new game (disables selection of cards ect.)
  const [handRank, setHandRank] = useState("IDK"); // holds the rank of the poker hand shown in the app
  const [bet, setBet] = useState(0); // this counts the size of the bet on any certain hand
  const [betMessage, setBetMessage] = useState(""); // changes the text shown on the page
  const deck = fetchedDeck; // the deck used for most card fuctionallty

  // adds to the bet on the chip button press
  async function placeBet() {
    if (newGame) {
      return;
    }
    const newBet = bet + 10;
    setBet(newBet);
    setBetMessage(` with A ${newBet} $ BET !`);
  }

  //finds the rank for a given hand(will be calling from a deck API call)
  async function getRank() {
    setHandRank("I don't know");
  }

  //counts the number of visble aces in a hand
  function numberOfUnselectedAces(cards) {
    return cards.reduce((count, card) => {
      return count + (card.rank === "A" && !card.selected ? 1 : 0);
    }, 0);
  }

  // this manages card selection according to game rules
  function toggleSelected(index) {
    // no selcetion for finished rounds
    if (newGame) {
      return;
    }

    const isAce = cards[index].rank === "A";

    // game bis logic
    if (!selected.includes(index)) {
      if (
        selected.length < 3 || // Allow selecting up to 3 cards normally
        (selected.length === 3 && unselectedAcesCount === 1 && !isAce) ||
        unselectedAcesCount > 1
      ) {
        // Allow selecting the fourth card if the last unselected card is an ace
        setSelected([...selected, index]);
        if (isAce) {
          setUnselectedAcesCount((prevCount) => prevCount - 1);
        }
      }
    } else {
      setSelected(selected.filter((item) => item !== index));
      if (isAce) {
        setUnselectedAcesCount((prevCount) => prevCount + 1);
      }
    }
  }

  // This function will be called when the Draw button is clicked
  const fetchNewCards = useCallback(async () => {
    let s = selected.length;
    if (newGame) {
      s = 5;
      setBetMessage("");
      setBet(0);
    }

    console.log(`need to fetch ${s} cards`);

    // fetch the new cards
    const fetchedCards = await deck.deal(s);

    // create the new hand with the fetched cards replacing the
    // selected cards
    let fetchedCardsIndex = 0;
    const newCards = cards.map((card, index) => {
      if (selected.includes(index) || s === 5) {
        // we map this card to the new card, and increment
        // our fetchedCardsIndex counter
        return fetchedCards[fetchedCardsIndex++];
      } else {
        return card;
      }
    });

    // returns discarded cards to the backend deck
    await deck.discard(cards, selected, newGame);
    // update state, causing a re-render

    setCards(newCards);
    setSelected([]);
    setNewGame(!newGame);
    setUnselectedAcesCount(numberOfUnselectedAces(newCards));
    //getRank();
    setBet(0);
  }, [selected, cards, newGame]);

  //returns the html used to build the app
  return (
    <div className="container">
      <Hand
        cards={cards}
        selected={selected}
        onSelect={(index) => toggleSelected(index)}
      />

      <DrawButton onClick={fetchNewCards} className="button" />

      <div id="handRank">
        you have a {handRank}
        {betMessage}!
      </div>
      <div class="vertical-line"></div>

      <div id="chip-container">
        <button id="chip-button" onClick={placeBet}>
          Gambling is fun!
        </button>
      </div>
    </div>
  );
}
