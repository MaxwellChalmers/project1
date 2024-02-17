from card import Card
import random

SUITS = ["C", "D", "H", "S"]
RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K", "A"]


class Deck:
    
    def __init__(self, id):
        print("Deck constructor")
        self.deck = [Card(rank, suit) for rank in RANKS for suit in SUITS]
        self.shuffle()
        self.id = id

    def drawCard(self):
        return self.deck.pop(0)

    def discard(self, card):
        self.deck.append(card)

    
    def shuffle(self):
        random.shuffle(self.deck)