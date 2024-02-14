# API Documentation (auto generated)

The `Api` class provides methods to interact with the card dealing API.

## Methods

### `deal()`

Fetches a single card from the API.

- **Returns**: A Promise that resolves to an object representing a single card.

### `deck(id)`

Fetches information about a deck of cards.

- **Parameters**:
  - `id` (string): Optional. The ID of the deck. If not provided, a new deck will be created.

- **Returns**: A Promise that resolves to an object containing information about the deck.

### `dealV2(id, count)`

Deals multiple cards from a specified deck.

- **Parameters**:
  - `id` (string): The ID of the deck from which to deal cards.
  - `count` (number): The number of cards to deal.

- **Returns**: A Promise that resolves to an array of objects representing the dealt cards.

### `findRank(hand)`

Finds the rank of a given hand of cards.

- **Parameters**:
  - `hand` (array of objects): The hand of cards for which to find the rank.

- **Returns**: A Promise that resolves to an object representing the rank of the hand.

## Usage

```javascript
import Api from './Api.js';

// Example usage of the Api class
async function exampleUsage() {
  // Deal a single card
  const card = await Api.deal();
  console.log('Dealt card:', card);

  // Fetch information about a deck
  const deckInfo = await Api.deck('deckId123');
  console.log('Deck info:', deckInfo);

  // Deal multiple cards from a deck
  const dealtCards = await Api.dealV2('deckId123', 5);
  console.log('Dealt cards:', dealtCards);
