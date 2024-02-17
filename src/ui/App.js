import Api from "./Api.js";
import Hand from "./Hand.js";
import Deck from "./Deck.js";

import { useState, useCallback } from "react";
import DrawButton from "./DrawButton.js";

export default function App({ initialCards, fetchedDeck }) {
  const [cards, setCards] = useState(initialCards);
  const [selected, setSelected] = useState([]);
  const [unselectedAcesCount, setUnselectedAcesCount] = useState(
    numberOfUnselectedAces(cards)
  );

  const [newGame, setNewGame] = useState(false);
  const [handRank, setHandRank] = useState("I don't know XD");
  const [bet, setBet] = useState(0);
  const [betMessage, setBetMessage] = useState("");
  const deck = fetchedDeck;

  async function placeBet() {
    if (newGame) {
      return;
    }
    const newBet = bet + 10;
    setBet(newBet);
    setBetMessage(` with A ${newBet} $ BET !`);
  }

  async function getRank() {
    setHandRank("I don't know");
  }

  function numberOfUnselectedAces(cards) {
    return cards.reduce((count, card) => {
      return count + (card.rank === "A" && !card.selected ? 1 : 0);
    }, 0);
  }

  function toggleSelected(index) {
    if (newGame) {
      return;
    }

    const isAce = cards[index].rank === "A";
    console.log(unselectedAcesCount);
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

    console.log(`need to fetch ${selected.length} cards`);

    // fetch the new cards
    console.log(deck);
    const fetchedCards = await deck.deal(s);

    console.log(fetchedCards);

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
    console.log("asdfasdfadsfdas");
    console.log(cards);
    console.log(selected);
    console.log(cards[1].rank);
    await deck.discard(cards, selected, newGame);
    // update state, causing a re-render

    setCards(newCards);
    setSelected([]);
    setNewGame(!newGame);
    setUnselectedAcesCount(numberOfUnselectedAces(newCards));
    //getRank();
    setBet(0);
  }, [selected, cards, newGame]);

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
