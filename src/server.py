import asyncio
import asyncpg
import random
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from deck import Deck
from fastapi import Query
from card import Card

SUITS = ["C", "D", "H", "S"]
RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K", "A"]
allDecks = {}

dummySecureId = "123"


app = FastAPI()
# make the secure ID per instance after the baseline is working and connected

@app.get("/api/v1/hello")
async def api_v1():
    return {"message": "Hello World!"}


@app.get("/api/v1/deal")
async def api_v1_deal():
    return {"rank": random.choice(RANKS), "suit": random.choice(SUITS)}


@app.post("/api/v2/deck/new")
async def api_v2_deck_new():
    d = Deck(dummySecureId)
    allDecks[dummySecureId] = d

    return {"message": d.id}


@app.get("/api/v2/deck/{deck_id}")
async def api_v2_deck(deck_id: str):
    print(f"need to fetch Deck {deck_id}")
    if (deck_id in allDecks.keys()):
        return deck_id
    raise HTTPException(status_code=404, detail=f"Deck {deck_id} not found")


@app.get("/api/v2/deck/{deck_id}/deal")
async def api_v2_deck(deck_id: str, count: int = Query(..., gt=0)):
    print(f"need to deal {count} cards from {deck_id}")
    if (deck_id in allDecks.keys()):
        d = allDecks[deck_id]
        drawnCards = []
        for i in range(0, count):
            drawnCards.append(d.drawCard())
        

        cards =  list()
        for i in range(0, count):
            c = drawnCards[i]
            print(c)
            cards.append({"rank": c.getRank(),"suit": c.getSuit()}) 
        
        return cards
    print(count)
    print(deck_id)
    raise HTTPException(status_code=404, detail=f"Deck {deck_id} not found")

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

app.mount("/", StaticFiles(directory="ui/dist", html=True), name="ui")
