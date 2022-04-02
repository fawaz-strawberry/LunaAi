/**
 * I'm making this in a seperate file cause like, it's a lot
 * 
 * 1. Establish cards of both house and player
 * 2. Implement system to display only one card of dealer but all other
 * cards
 * 3. Hit will add another card to the player
 * 4. Stay will then reveal dealer cards to player and calculate score
 * 5. After each hit, determine if player is over 21. Aces will be assumed 11 unless
 * eleven + the rest of the hand is greater than 21
 * 6. 
 */

class BlackJack{

    constructor(betAmt){
        this.DECK = ["ace_d", "two_d", "three_d", "four_d", "five_d", "six_d", "seven_d", "eight_d", "nine_d", "ten_d", "jack_d", "queen_d", "king_d",
        "ace_s", "two_s", "three_s", "four_s", "five_s", "six_s", "seven_s", "eight_s", "nine_s", "ten_s", "jack_s", "queen_s", "king_s",
        "ace_h", "two_h", "three_h", "four_h", "five_h", "six_h", "seven_h", "eight_h", "nine_h", "ten_h", "jack_h", "queen_h", "king_h",
        "ace_c", "two_c", "three_c", "four_c", "five_c", "six_c", "seven_c", "eight_c", "nine_c", "ten_c", "jack_c", "queen_c", "king_c"]
        this.remainDECK = this.DECK

        this.houseHand = []
        this.yourHand = []
        this.cash = betAmt

    }

    startingHand(){
        
        var card = this.getCard()
        this.houseHand.push(this.remainDECK[card])
        this.remainDECK.splice(card)

        card = this.getCard()
        this.yourHand.push(this.remainDECK[this.getCard()])
        this.remainDECK.splice(card)

        card = this.getCard()
        this.houseHand.push(this.remainDECK[this.getCard()])
        this.remainDECK.splice(card)

        card = this.getCard()
        this.yourHand.push(this.remainDECK[this.getCard()])
        this.remainDECK.splice(card)
        
    }

    getCard(){
        return Math.floor(Math.random() * this.remainDECK.length)
    }

    catchTheseHands(){
        var myString = ""
        myString = "The house has "
        for(var i = 0; i < this.houseHand.length; i++){
            myString += this.houseHand[i].split("_")[0] + " "
        }
        myString += "\n\nYou have "
        for(var i = 0; i < this.yourHand.length; i++){
            myString += this.yourHand[i].split("_")[0] + " "
        }

        return myString
    }

    hitMe(){
    }

}

module.exports = BlackJack