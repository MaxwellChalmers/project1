import asyncio
import asyncpg
import random
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from deck import Deck
from fastapi import Query
from card import Card
import secrets
import string


SUITS = ["C", "D", "H", "S"]
RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K", "A"]
allDecks = {}


# fully made by chatGPT, secrets is supposed to be cryptographically secure so hopefully that 
# means there will not be any dupes 
def deckNamer():
    # Define the characters to choose from for the random string
    characters = string.ascii_letters + string.digits  # You can include other characters if needed

    # Generate a random string of the specified length
    deck_name = ''.join(secrets.choice(characters) for _ in range(100))
    
    return deck_name


app = FastAPI()
# make the secure ID per instance after the baseline is working and connected

app = FastAPI()

@app.get("/api/v1/hello")
async def api_v1():
    return {"message": "Hello World!"}


@app.get("/api/v1/deal")
async def api_v1_deal():
    return {"rank": random.choice(RANKS), "suit": random.choice(SUITS)}


#creates a new deck with a unique ID 
@app.post("/api/v2/deck/new")
async def api_v2_deck_new():
    secureId = deckNamer()
    d = Deck(secureId)
    allDecks[secureId] = d

    return {"message": d.id}

#checks to see if a deck with a certain ID exists
@app.get("/api/v2/deck/{deck_id}")
async def api_v2_deck(deck_id: str):
    print(f"need to fetch Deck {deck_id}")
    if (deck_id in allDecks.keys()):
        return deck_id
    raise HTTPException(status_code=404, detail=f"Deck {deck_id} not found")

#deals count number of cards from deck with id deck_id
@app.get("/api/v2/deck/{deck_id}/deal")
async def api_v2_deck(deck_id: str, count: int = Query(..., gt=0)):
    #print(f"need to deal {count} cards from {deck_id}")

    if (deck_id in allDecks.keys()):
        d = allDecks[deck_id]
        drawnCards = []
        for i in range(0, count):
            drawnCards.append(d.drawCard())
        cards =  list()
        for i in range(0, count):
            c = drawnCards[i]
            cards.append({"rank": c.getRank(),"suit": c.getSuit()}) 
        
        return cards
    raise HTTPException(status_code=404, detail=f"Deck {deck_id} not found")

#converts card string sent from frontend into python card Classes
def stringToCards(cardS: str):
    suits = []
    ranks = []
    cards = [] 
    for i in range (0, len(cardS), 2): 
        ranks.append(cardS[i])
     
    for i in range(1, len(cardS), 2):
        suits.append(cardS[i])
    
    for i in range (0, len(suits)):
        cards.append(Card(ranks[i], suits[i]))
    return cards
    

# adds cards discarded back into the deck Class with ID deck_id 
@app.post("/api/v2/deck/{deck_id}/discard/~{cards}")
async def discard_cards(deck_id: str, cards: str):
    if deck_id not in allDecks.keys():
        raise HTTPException(status_code=404, detail=f"Deck {deck_id} not found")
    if cards == "NONE":
        return {"message": "No cards to be discarded"}
    addToDeck = stringToCards(cards)
    for card in addToDeck:
        allDecks[deck_id].discard(card)
    allDecks[deck_id].shuffle()    
    
    return {"message": "Cards discarded successfully"}



@app.get("/api/v2/highestRank/~{cards}")
async def highest_rank(cards: str):
    hand = stringToCards(cards)
    if isStraightFlush(hand):
        return {"message": "Straight Flush"}
    if isFourOfAKind(hand):
        return {"message": "Four of A Kind"}
    if isFullHouse(hand):
        return {"message": "Full House"}
    if isFlush(hand):
        return {"message": "Flush"}
    if isStraight(hand):
        return {"message": "Straight"}
    if isThreeOfAKind(hand):
        return {"message": "Three of A Kind"}
    if isTwoPair(hand):
        return {"message": "Two Pair"}
    if isPair(hand):
        return {"message": "One Pair"}
    
    return {"message": "High Card"}

def isStraightFlush(hand: list[Card]) -> bool:
    isstraight = isStraight(hand)
    isflush = isFlush(hand)
    return isstraight and isflush

def isFlush(hand: list[Card]) -> bool:
    flush = True
    suit = hand[0].getSuit() 
    for c in hand:
        if c.getSuit() != suit:
            flush = False
            break
    
    return flush

# a true abomination of coding style but I think it will work           
def isStraight(hand: list[Card]) -> bool:
    if isPair(hand):
        return False
    lowest = [hand[0].getRankNumbers()[0], hand[0].getRankNumbers()[1]]
    highest = [hand[0].getRankNumbers()[0], hand[0].getRankNumbers()[1]]

    for handVals in hand:
        if handVals.getRankNumbers()[0] < lowest[0]:
            lowest[0] = handVals.getRankNumbers()[0]
        if handVals.getRankNumbers()[0] > highest[0]:
            highest[0] = handVals.getRankNumbers()[0]
        if handVals.getRankNumbers()[1] < lowest[1]:
            lowest[1] = handVals.getRankNumbers()[1]
        if handVals.getRankNumbers()[1] > highest[1]:
            highest[1] = handVals.getRankNumbers()[1]
    if highest[0] - lowest[0] == 4:
        return True
    if highest[1] - lowest[1] == 4:
        return True
    
    return False
        
def isPair(hand: list[Card]) -> bool:
    for i in range(0, 5):
        for k in range(i + 1, 5):
            if hand[i].getRank() == hand[k].getRank():
                return True
            
    return False


def isFourOfAKind(hand: list[Card]) -> bool:
    diffrentcards = 0
    card = hand[0] 
    for i in range (1, 5):
        if card.getRank() != hand[i].getRank():
            diffrentcards += 1
    if diffrentcards == 1:
        return True
    card = hand[1]
    for i in range(2,5):
        if card.getRank() != hand[i].getRank():
            return False

    return True        
    

def isFullHouse(hand: list[Card]) -> bool:
    ispair = False
    isthree = False
    threeRank = "N"
    for i in range(0, 3):
        card = hand[i]
        count = 0
        for k in range(i + 1, 5):
            if card.getRank() == hand[k].getRank():
                count += 1
        if count == 2:
            isthree = True
            threeRank = card.getRank()

    
    for i in range(0, 4):
        card = hand[i]
        count = 0
        for k in range(i + 1, 5):
            if card.getRank() == hand[k].getRank() and card.getRank() != threeRank:
                count += 1
        if count == 1:
            ispair = True

    return (ispair and isthree)


def isThreeOfAKind(hand: list[Card]) -> bool:
    for i in range(0, 3):
        card = hand[i]
        count = 0
        for k in range(i + 1, 5):
            if card.getRank() == hand[k].getRank():
                count += 1
        if count == 2:
            return True
    return False
        
        

def isTwoPair(hand: list[Card]) -> bool:
    firstpair = "n"
    for i in range(0, 4):
        card = hand[i]
        count = 0
        for k in range(i + 1, 5):
            if card.getRank() == hand[k].getRank():
                firstpair = card.getRank()    
    for i in range(0, 4):
        card = hand[i]
        count = 0
        for k in range(i + 1, 5):
            if card.getRank() == hand[k].getRank() and card.getRank() != firstpair:
                return True

    return False








app.mount("/", StaticFiles(directory="ui/dist", html=True), name="ui")
