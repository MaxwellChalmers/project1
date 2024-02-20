import React, { useState, useCallback } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import Hand from "./Hand";
import DrawButton from "./DrawButton";
import Api from "./Api";
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe(
  "pk_test_51OlO0XKFHrKzuFABsClQQyegseXxBRLbsMWwROCNwk83My9yEoCKMV29I0UimYpAyZMkcRHlxy73DApP2nYqirNj00ulxTiYiW"
);

export default function App({ initialCards, fetchedDeck, initialRank }) {
  const [cards, setCards] = useState(initialCards);
  const [selected, setSelected] = useState([]);
  const [unselectedAcesCount, setUnselectedAcesCount] = useState(
    numberOfUnselectedAces(cards)
  );
  const [newGame, setNewGame] = useState(false);
  const [handRank, setHandRank] = useState(initialRank);
  const [bet, setBet] = useState(0);
  const [betMessage, setBetMessage] = useState("");
  const deck = fetchedDeck;


  const [isHighroller, setIsHighroller] = useState("BECOME A HIGHROLLER TODAY!!!!1")
  const [betIncrement, setBetIncrement] = useState(10); // Initial bet increment
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  const handleSuccessPayment = () => {
    // Update state to indicate successful payment
    setPaymentSuccessful(true);
    // Adjust bet increment after successful payment
    setBetIncrement(100); // Change to 100 after successful payment
    setIsHighroller("CONGRATUEALTIONS! YOU ARE NOW at THE HIGHROLLERS TABLE!");
  };


  async function placeBet() {
    if (newGame) {
      return;
    }
    const newBet = bet + betIncrement;
    setBet(newBet);
    setBetMessage(` with A ${newBet} $ BET !`);
  }

  async function getRank(hand) {
    const rank = await deck.highestRank(hand);
    setHandRank(rank);
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

    if (!selected.includes(index)) {
      if (
        selected.length < 3 ||
        (selected.length === 3 && unselectedAcesCount === 1 && !isAce) ||
        unselectedAcesCount > 1
      ) {
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

  const fetchNewCards = useCallback(async () => {
    let s = selected.length;
    if (newGame) {
      s = 5;
      setBetMessage("");
      setBet(0);
    }

    console.log(`need to fetch ${s} cards`);

    const fetchedCards = await deck.deal(s);

    let fetchedCardsIndex = 0;
    const newCards = cards.map((card, index) => {
      if (selected.includes(index) || s === 5) {
        return fetchedCards[fetchedCardsIndex++];
      } else {
        return card;
      }
    });

    await deck.discard(cards, selected, newGame);
    setCards(newCards);
    setSelected([]);
    await getRank(newCards);
    setNewGame(!newGame);
    setUnselectedAcesCount(numberOfUnselectedAces(newCards));
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
        You have a {handRank}
        {betMessage}!
      </div>
      <div className="vertical-line"></div>
  
      <div id="chip-container">
        <button id="chip-button" onClick={placeBet}>
          Gambling is fun!
        </button>
      </div>
  
      {/* Payment form */}
      <div className="payment-form">
        <Elements stripe={stripePromise}>
        <PaymentForm onSuccessPayment={handleSuccessPayment} />
        </Elements>
      </div>
  
      {/* Text */}
      <div className="highroller-text">{isHighroller}</div>
    </div>
  );
  
}

export default App;
