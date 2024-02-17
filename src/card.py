class Card:
    def __init__(self,rank,suit):
        self.s = suit
        self.r = rank
        match rank:
            case "A":
                self.rNum = (1, 14)
            case "K":
                self.rNum = (13, 13)
            case "Q":
                self.rNum = (12, 12)
            case "J":
                self.rNum = (11, 11)
            case "0":
                self.rNum =(10, 10)
            case _:
                self.rNum =(rank, rank) 
        
    def getRank(self):
        return self.r
    def getSuit(self):
        return self.s