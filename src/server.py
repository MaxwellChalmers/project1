import asyncio
import asyncpg
import random
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from deck import Deck
from fastapi import Query

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



app.mount("/", StaticFiles(directory="ui/dist", html=True), name="ui")
