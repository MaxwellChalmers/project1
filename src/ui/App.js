import Api from "./Api.js";
import Hand from "./Hand.js";
import Deck from "./Deck.js";

import { useState, useCallback } from "react";
import DrawButton from "./DrawButton.js";
/**
   Note: For each game, we'll only allow the "Draw" to happen once.
   This means we should hide the "Draw" button after it is clicked.
   Better yet, let's change it to a different "Play Again" button that
   resets everything and plays another hand (with a new Deck).
**/
export default function App({ initialCards, deck }) {

  const [cards, setCards] = useState(initialCards);
  const [selected, setSelected] = useState([]);
  const [unselectedAcesCount, setUnselectedAcesCount] = useState(
    numberOfUnselectedAces(cards)
  );

  // const deck =  Deck(fetchedDeck.deckID); 

  const [newGame, setNewGame] = useState(false);
  const [handRank, setHandRank] = useState("I don't know XD");
  const [bet, setBet] = useState(0);
  const [betMessage, setBetMessage] = useState("");

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
    // setUnselectedAcesCount(numberOfUnselectedAces(cards));

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
    const fetchedCards = await deck.dealV2(s);

    //await Promise.all(
    /**
         This is some wacky functional programming magic. It's bad
         code, but you should practice understanding it.  Essentially,
         we're creating a new array of the appropriate length, then
         mapping over it to create an array of Promises, which we then
         await.

         Once API v2 is created, we can delete this and change it to a
         much simpler single API call that specifies the number of
         cards we want dealt.
       **/
    // Array.from(Array(s).keys()).map((arg, index) => {
    //   return Api.deal();
    //})
    //);

    // let's print out the fetched cards
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

    // await deck.discard(cards, selected);
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
