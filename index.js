const Discord = require('discord.js');
const{ MessageActionRow, MessageButton } = require('discord.js')
const config = require("./config.json");
const fetch = require('node-fetch');
const axios = require("axios")
const Jimp = require('jimp') ;
const BlackJack = require("./blackjack")
const { Octokit } = require("@octokit/core");

//const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const octokit = new Octokit({ auth: config.GITHUB_TOKEN });

const client = new Discord.Client({intents:["GUILDS", "GUILD_MESSAGES"]});
const prefix = ".";

var user_sha = ""
var user_data = ""

var button_count = 0

GITHUB_API = "https://api.github.com/repos/fawaz-strawberry/"
ADD_FILE = "LunaAi/contents/"

client.on("messageCreate", function(message) {
    if (message.author.bot) return;
    if(!message.content.startsWith(prefix)) {
        if(message.content.indexOf("420") != -1)
        {
            message.reply("Someone say 420?\nhttps://thumbs.gfycat.com/WideeyedFarawayBlueandgoldmackaw-size_restricted.gif")
        }
        if(message.content.toLowerCase().indexOf("comrade") != -1)
        {
            message.channel.send("<:DomSalute:877258854444978247>")
        }
        if(message.content.toLowerCase().indexOf("loser") != -1 || message.content.toLowerCase().indexOf("cringe") != -1)
        {
            message.reply("no u")
        }
        if(checkIfContains(["pog", "poggies", "poggers"], message.content.toLowerCase())){
            message.channel.send("<:MegaPog:735002364133507122>")
        }

        return

    };

    function checkIfContains(listToCheck, checkWithString){
        for(var i = 0; i < listToCheck.length; i++){
            if(checkWithString.indexOf(listToCheck[i]) != -1)
            {
                return true
            }
        }
        return false
    }
    
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    console.log("Args: " + args)
    console.log("Command: " + command)

    if(command === "ping"){
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    }

    if(command === "咬人猫"){
        message.reply("https://www.youtube.com/watch?v=f9DyUvyIOfo")
    }

    /**
     * Send Birthday Wishes to specified Users!
     */
    if(command === "birthday"){
        if(args[0].startsWith('<@') && args[0].endsWith('>')){
            birthday_count = 1
            message_count = 1
            mega_string = ""
            if(args.length == 2)
            {
                birthday_count = parseInt(args[1])
            }
            
            if(birthday_count > 50){
                message_count = Math.floor(birthday_count / 50)
                birthday_count = birthday_count - (message_count * birthday_count)
                birthday_count = 50
            }

            if(message_count > 5){
                message_count = 5
                mega_string += "Ok bud you need to chill, 5 messages max\n"
            }

            for(var i = 0; i < message_count; i++)
            {
                for(var j = 0; j < birthday_count; j++)
                {
                    mega_string += "Happy Birthday " + args[0] + "!\n"
                }
                
                message.channel.send(mega_string)
                mega_string = "Happy Birthday\n"
            }
            
        }
    }
    
    

    if(command === "blackjack")
    {
        button_count += 1
        console.log("Creating Post: " + button_count)
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary' + '_' + button_count.toString())
					.setLabel('Start')
					.setStyle('PRIMARY'),
			);
            
        var myMessage = message.channel.send({embeds: [setTable()], components: [row]})
                
        // const collector = message.createMessageComponentCollector({time:15 * 1000})
        // collector.on('collect', i => {
        //     if (i.user.id === myMessage.user.id) {
        //         i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
        //     } else {
        //         i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
        //     }
        // });
        
        // collector.on('end', collected => {
        //     console.log(`Collected ${collected.size} interactions.`);
        // });
    }



    


    function maxHand(myCards){

    }



    

    if(command === "sum")
    {
        var sum = 0
        for(var i = 0; i < args.length; i++)
        {
            var num = parseFloat(args[i])
            if(num !== NaN)
            {
                sum += num
            }
            else
            {
                message.reply('Invalid argument: ' + args[i])
            }
        }
        message.reply('= ' + sum)
    }



    if(command === "profile")
    {
        octokit.request('GET /repos/fawaz-strawberry/LunaAi/contents/user_info_final.json', {
        }).then(response => {
            
            user_sha = response.data.sha
            let buff = Buffer.from(response.data.content, 'base64');  
            let text = buff.toString('utf-8');
            user_data = JSON.parse(text)

        }).then(() => {

            //aka user exists
            if(user_data.hasOwnProperty(message.author.id))
            {
                var myUser = user_data[message.author.id]

                if(args[0] === "view" || args.length === 0)
                {
                    message.channel.send({embeds: [generateUserProfile(message.author.id, message.author.username)]})
                }
                else if(args[0] === "set")
                {
                    if(args[1] === "birthday")
                    {
                        if(isNaN(args[2])){
                            input = args[2].split("/")
                            month = convertMonthToNum(input[0])
                            day = input[1] 
                        }
                        else{
                            month = args[2]
                        }       

                        if(month === -1 || day > 31 || day <= 0)
                        {
                            message.reply("Invalid Input Loser")
                            return;
                        }

                        setAttribute(message.author.id, "birth_month", month)
                        setAttribute(message.author.id,  "birth_day", day)
                        
                        uploadUserData()
                        
                        message.reply(message.author.username + " birthday set to " + month + "/" + day)
                        return;
                    }
                    else{
                        message.reply("Set what?(Will show options in the future)")
                    }   
                }
                else if(args[0] == "add")
                {
                    addCustomField(message.author.id, args[1], args[2])
                    uploadUserData()
                    message.reply("Added new field: " + args[1] + " with value: " + args[2] + " to your account")
                }
                else if(args[0] === "birthday")
                {

                    if(user_data[message.author.id]["birth_month"] === undefined || user_data[message.author.id]["birth_day"] === undefined)
                    {
                        message.reply("Please set your birthday first using .profile set birthday month day")
                    }
                    else
                    {
                        message.reply("Your birthday is on " + user_data[message.author.id]["birth_month"] + "/" + user_data[message.author.id]["birth_day"])
                    }

                }
                else
                {
                    message.reply("Display Options to Set Here")
                }
            }
            else
            {
                //Just straight up create user and view it
                message.reply("Could not find user: " + message.author + "\nCreating Account Now... try again in few seconds")
                createUser(message.author)
            }

        }).catch((err) => {
            console.log(err)
        })
    }



    if(command == "help")
    {
        message.channel.send({embeds: [generateHelp()]})
    }

    if(command == "speak")
    {
        finalarg = ""
        for(var i = 0; i < args.length; i++){
            finalarg += args[i] + " "
        }
        axios.post("http://192.168.0.214:4000/modelResponse", {
            message:"NAME: Person_1\n" + finalarg + "\n\n"
        }).then(response => {
            console.log("\\n\n\n-----------------------------------\n")
            myString = ((response.data).toString()).split("NAME:")
            //myString.slice(myString.indexOf("\n"), myString.indexOf("NAME"))
            myReplies = myString[1].split("\n")
            
            console.log(myReplies)

            final_reply = ""
            for(var i = 1; i < myReplies.length; i++)
            {
                final_reply += myReplies[i] + "\n"
            }
            message.reply(final_reply)
            //.reply(response.data.split(response.data.indexOf("\r\n"), response.data.indexOf("\r\n\r\n")))
        }).catch(err => {
            console.log(err)
            message.reply("My vocal cords currently need maintenence. Yell at Fawaz to fix em.")
        })
    }

});


function generateHelp(){
    const myEmbed = new Discord.MessageEmbed()
    myEmbed.setTitle("Commands")
    myEmbed.setDescription("The following is a list of commands and usage")
    myEmbed.addFields(
        {name: "Calculate Sum", value: ".sum 'num1' 'num2' 'num3'..."},
        {name: "Send Birthday Messages", value: ".birthday 'number of messages'"},
        {name: "View Profile", value:".profile || .profile view"},
        {name: "Set Birthday", value:".profile set birthday 'month day' || .profile set birthday 'mm/dd'"}
    )

    return myEmbed
}

function setTable() {
    const myEmbed = new Discord.MessageEmbed()
    myEmbed.setTitle("BlackJack Table")
    myEmbed.setDescription("Welcome to the table, you have selected to gamble away x amount of dollars today. Are you sure you want to play?")
    myEmbed.setImage("https://cdn0.iconfinder.com/data/icons/casino-15/512/as447_7-1024.png")
    myEmbed.setFooter({text: "You should not be able to see this hopefully", iconURL: 'https://i.imgur.com/AfFp7pu.png'})
    return myEmbed
}

DECK = ["ace_d", "two_d", "three_d", "four_d", "five_d", "six_d", "seven_d", "eight_d", "nine_d", "ten_d", "jack_d", "queen_d", "king_d",
        "ace_s", "two_s", "three_s", "four_s", "five_s", "six_s", "seven_s", "eight_s", "nine_s", "ten_s", "jack_s", "queen_s", "king_s",
        "ace_h", "two_h", "three_h", "four_h", "five_h", "six_h", "seven_h", "eight_h", "nine_h", "ten_h", "jack_h", "queen_h", "king_h",
        "ace_c", "two_c", "three_c", "four_c", "five_c", "six_c", "seven_c", "eight_c", "nine_c", "ten_c", "jack_c", "queen_c", "king_c"]

DECK_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]


async function gameStart() {
    const myEmbed = new Discord.MessageEmbed()
    

    const image = await Jimp.read('C:/Users/fawaz/Pictures/PokerTable.png');
    // Defining the text font
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
    
    // Writing image after processing
    

    

    var hiddenCard = Math.floor(Math.random() * 52)
    var player_1 = Math.floor(Math.random() * 52)
    while(player_1 === hiddenCard)
    {
        player_1 = Math.floor(Math.random() * 52)
    }
    var dealerCard = Math.floor(Math.random() * 52)
    while(dealerCard === player_1 || dealerCard === hiddenCard)
    {
        dealerCard = Math.floor(Math.random() * 52)
    }
    var player_2 = Math.floor(Math.random() * 52)
    while(player_2 === player_1 || player_2 === dealerCard || player_2 === hiddenCard)
    {
        player_2 = Math.floor(Math.random() * 52)
    }

    //Generate random two numbers for Table
    //Generate random two for player

    table_cards = []
    player_cards = []

    let hexStr = hiddenCard.toString(16);
    if(hexStr.length === 1)
    {
        hexStr = "0" + hexStr
    }


    image.print(font, 290, 550, getCardLetter(DECK[player_1]));
    image.print(font, 290, 350, getCardLetter(DECK[dealerCard]));
    image.print(font, 380, 550, getCardLetter(DECK[player_2]));

    await image.writeAsync('C:/Users/fawaz/Pictures/PokerTable_START.png');

    myEmbed.setColor("#0099" + hexStr)
    myEmbed.setTitle("BlackJack Table")
    myEmbed.setDescription("Dealer: " + DECK[dealerCard] + "\n" + "Player: " + DECK[player_1] + " " + DECK[player_2])
    myEmbed.setImage("attachment://PokerTable_START.png")
    return myEmbed
}


/**
 * Creates the embed of the current users profile
 * @param {*} userID 
 * @param {*} username 
 * @returns 
 */
function generateUserProfile(userID, username)
{

    const myEmbed = new Discord.MessageEmbed()
    myEmbed.setColor('#0099ff')
    myEmbed.setTitle(username)
    myEmbed.setImage(user_data[userID]["profile_pic"])
    myEmbed.setDescription("This user is a loser :)")
    myEmbed.addFields(
		{ name: 'Birthday', value: user_data[userID]["birth_month"] + "/" + user_data[userID]["birth_day"] },
	)

    console.log(user_data[userID])
    for(var i = 0; i < user_data[userID]["special_info"].length; i++)
    {
        myEmbed.addFields(
            {name: user_data[userID]["special_info"][i]["name"], value: user_data[userID]["special_info"][i]["value"]}
        )
    }

    return myEmbed
}

/**
 * Just straight up creates the base user and saves it into the profiles json
 * @param {*} author 
 */
function createUser(author){
    user_data[author.id] = {"profile_pic":author.avatarURL(), "Description":"New User", "Money":200, "Level":1, "special_info":[]}
    console.log(user_data)
    uploadUserData()
}

/**
 * Saves current state of user data into the json
 */
function uploadUserData(){
    octokit.request('PUT /repos/fawaz-strawberry/LunaAi/contents/user_info_final.json', {
        message: 'message',
        content: btoa(JSON.stringify(user_data)),
        sha: user_sha
    })
}

/**
 * Add new custom field that should be displayed to user
 * @param {userID} input 
 * @returns 
 */
function addCustomField(userID, name, value){
    if(!("special_info" in user_data[userID]))
    {
        user_data[userID]["special_info"] = [{"name":name, "value":value}]
    }
    else{
        user_data[userID]["special_info"].push({"name":name, "value":value})
    }
}


function convertMonthToNum(input){
    if(input === "january" || input === "jan" || input === 1 || input === "01")
    {
        return "01"
    }
    if(input === "february" || input === "feb"|| input === 2 || input === "02")
    {
        return "02"
    }
    if(input === "march" || input === "mar"|| input === 3 || input === "03")
    {
        return "03"
    }
    if(input === "april" || input === "apr"|| input === 4 || input === "04")
    {
        return "04"
    }
    if(input === "may"|| input === 5 || input === "05")
    {
        return "05"
    }
    if(input === "june" || input === "jun"|| input === 6 || input === "06")
    {
        return "06"
    }
    if(input === "july" || input === "jul"|| input === 7 || input === "07")
    {
        return "07"
    }
    if(input === "august" || input === "aug"|| input === 8 || input === "08")
    {
        return "08"
    }
    if(input === "september" || input === "sept"|| input === 9 || input === "09")
    {
        return "09"
    }
    if(input === "october" || input === "oct"|| input === 10 || input === "10")
    {
        return "10"
    }
    if(input === "november" || input === "nov"|| input === 11 || input === "11")
    {
        return "11"
    }
    if(input === "december" || input === "dec"|| input === 12 || input === "12")
    {
        return "12"
    }
    return -1
}

function setAttribute(user_id, field, value){
    user_data[user_id][field] = value
}


client.on('interactionCreate', async interaction => {

    console.log(interaction.customId + " -------------------------------------------")

    if (!interaction.isButton()) return;
    if(interaction.customId.startsWith("primary"))
    {
        console.log("Updating Embed")
        button_count += 1
        const row = new MessageActionRow()
    	.addComponents(
    		new MessageButton()
    			.setCustomId('hit')
    			.setLabel('HIT')
    			.setStyle('SUCCESS'),
            new MessageButton()
    			.setCustomId('stand')
    			.setLabel('STAND')
    			.setStyle('DANGER')
    	);
        var myEmbed = await gameStart()
        await interaction.update({embeds: [myEmbed], files:["C:/Users/fawaz/Pictures/PokerTable_START.png"], components: [row] });
    }else if(interaction.customId.startsWith("hit"))
    {


        const image = await Jimp.read('C:/Users/fawaz/Pictures/PokerTable.png');
        // Defining the text font
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);

        //Get player current cards draw a new card and then determine if we are illegal
        console.log("Pog champ")

        console.log()

        var description = interaction.message.embeds[0].description
        
        var dealer_cards = description.split("\n")[0].split(" ")
        var dealer_hidden = interaction.message.embeds[0].hexColor.slice(-2)
        var player_cards = description.split("\n")[1].split(" ")
        
        dealer_cards.shift(1)
        player_cards.shift(1)

        console.log("Prior")
        console.log(dealer_cards)
        console.log(player_cards)

        
        
        dealer_cards.push(DECK[parseInt(dealer_hidden, 16)])
        player_cards.push(getNewCard([].concat(dealer_cards, player_cards)))

        console.log("After")
        console.log(dealer_cards)
        console.log(player_cards)

        if(checkHand(player_cards) > 21)
        {
            var new_description = "Game Over! You went over 21\nDealer:"
            
            for(var i = 0; i < dealer_cards.length-1; i++)
            {
                new_description += " " + dealer_cards[i]
                image.print(font, 290 + 95 * i, 350, getCardLetter(dealer_cards[i]))
                name_additions += "_" + dealer_cards[i]
            }
            new_description += "\nPlayer:"
            for(var i = 0; i < player_cards.length; i++)
            {
                new_description += " " + player_cards[i]
                image.print(font, 290 + 95 * i, 550, getCardLetter(player_cards[i]))
                name_additions += "_" + player_cards[i]  
            }
            old_embed = interaction.message.embeds[0]
            old_embed.setDescription(new_description)
    
            
    
            await image.writeAsync('C:/Users/fawaz/Pictures/PokerTable_' + name_additions + ".png");
            old_embed.setImage("attachment://PokerTable_" + name_additions + ".png")
           
            
            await interaction.update({embeds: [old_embed], files:['C:/Users/fawaz/Pictures/PokerTable_' + name_additions + ".png"], components:[]});
        }
        else
        {
            var new_description = "Dealer:" 
            var name_additions = ""

            for(var i = 0; i < dealer_cards.length-1; i++)
            {
                new_description += " " + dealer_cards[i]
                image.print(font, 290 + 95 * i, 350, getCardLetter(dealer_cards[i]))
                name_additions += "_" + dealer_cards[i]
            }
            new_description += "\nPlayer:"
            for(var i = 0; i < player_cards.length; i++)
            {
                new_description += " " + player_cards[i]
                image.print(font, 290 + 95 * i, 550, getCardLetter(player_cards[i]))
                name_additions += "_" + player_cards[i]            
            }
            
            old_embed = interaction.message.embeds[0]
            old_embed.setDescription(new_description)
    
            
            
    
            await image.writeAsync('C:/Users/fawaz/Pictures/PokerTable_' + name_additions + ".png");
            old_embed.setImage("attachment://PokerTable_" + name_additions + ".png")
           
            
            await interaction.update({embeds: [old_embed], files:['C:/Users/fawaz/Pictures/PokerTable_' + name_additions + ".png"]});
        }


    }
    else if(interaction.customId.startsWith("stand"))
    {

        const image = await Jimp.read('C:/Users/fawaz/Pictures/PokerTable.png');
        // Defining the text font
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);

        //Get player current cards draw a new card and then determine if we are illegal
        console.log("Pog champ")

        console.log()

        var description = interaction.message.embeds[0].description

        var dealer_cards = description.split("\n")[0].split(" ")
        var dealer_hidden = interaction.message.embeds[0].hexColor.slice(-2)
        var player_cards = description.split("\n")[1].split(" ")

        dealer_cards.shift(1)
        player_cards.shift(1)

        console.log("Prior")
        console.log(dealer_cards)
        console.log(player_cards)

        dealer_cards.push(DECK[parseInt(dealer_hidden, 16)])

        var hand_value = checkHand(dealer_cards)
        while(hand_value < 17)
        {
            dealer_cards.push(getNewCard([].concat(dealer_cards, player_cards)))
            hand_value = checkHand(dealer_cards)
        }

        var player_value = checkHand(player_cards)
        if(player_value >= hand_value || hand_value > 21)
        {
            var new_description = "You Win!\n"
            var name_additions = ""

            new_description += "Player:"
            
            for(var i = 0; i < player_cards.length; i++)
            {
                new_description += " " + player_cards[i]
                image.print(font, 290 + 95 * i, 550, getCardLetter(player_cards[i]))
                name_additions += "_" + player_cards[i]
            }
            new_description += "\nDealer:"
            for(var i = 0; i < dealer_cards.length; i++)
            {
                new_description += " " + dealer_cards[i]
                image.print(font, 290 + 95 * i, 350, getCardLetter(dealer_cards[i]))
                name_additions += "_" + dealer_cards[i]
            }
            old_embed = interaction.message.embeds[0]
            new_description += "\nP: " + player_value + " D:" + hand_value
            old_embed.setDescription(new_description)

            await image.writeAsync('C:/Users/fawaz/Pictures/PokerTable_' + name_additions + ".png");
            old_embed.setImage("attachment://PokerTable_" + name_additions + ".png")

            await interaction.update({embeds: [old_embed], files:['C:/Users/fawaz/Pictures/PokerTable_' + name_additions + ".png"], components:[]});
        }
        else
        {


            var new_description = "Game Over!\nDealer:" 
            var name_additions = ""
            
            for(var i = 0; i < dealer_cards.length; i++)
            {
                new_description += " " + dealer_cards[i]
                image.print(font, 290 + 95 * i, 350, getCardLetter(dealer_cards[i]))
                name_additions += "_" + dealer_cards[i]
            }
            new_description += "\nPlayer:"
            for(var i = 0; i < player_cards.length; i++)
            {
                new_description += " " + player_cards[i]
                image.print(font, 290 + 95 * i, 550, getCardLetter(player_cards[i]))
                name_additions += "_" + player_cards[i]
            }
            
            new_description += "\nP: " + player_value + " D:" + hand_value
            old_embed = interaction.message.embeds[0]
            old_embed.setDescription(new_description)
            
            await image.writeAsync('C:/Users/fawaz/Pictures/PokerTable_' + name_additions + ".png");
            old_embed.setImage("attachment://PokerTable_" + name_additions + ".png")
           
            
            await interaction.update({embeds: [old_embed], files:['C:/Users/fawaz/Pictures/PokerTable_' + name_additions + ".png"], components:[]});
        }


    }


});

function getNewCard(cardList){
    var myNewCard = DECK[Math.floor(Math.random() * 52)]
    while(cardList.indexOf(myNewCard) != -1)
    {
        myNewCard = DECK[Math.floor(Math.random() * 52)]
    }
    return myNewCard
}

function checkHand(cardList){

    var total_value = 0
    var num_aces = 0

    for(var i = 0; i < cardList.length; i++){
        var card_value = DECK.indexOf(cardList[i]) % 13 + 1 
        console.log("Deck: " + cardList[i] + " Value: " + card_value)
        if(card_value === 1)
        {
            num_aces += 1
            total_value += 1
        }
        else if(card_value > 10)
        {
            total_value += 10
        }
        else
        {
            total_value += card_value
        }
    }

    for(var i = 0; i < num_aces; i++){
        if(total_value + 10 <= 21){
            total_value += 10
        }
    }

    console.log("Total Value: " + total_value)
    return total_value

}

function getCardLetter(cardName){
    
    var letter = ""
    
    var card_value = DECK.indexOf(cardName) % 13 + 1 
    if(card_value === 1)
    {
        letter = "A"
    }
    else if(card_value == 10)
    {
        letter = "T"
    }
    else if(card_value == 11)
    {
        letter = "J"
    }
    else if(card_value == 12)
    {
        letter = "Q"
    }
    else if(card_value == 13)
    {
        letter = "K"
    }
    else
    {
        letter = card_value.toString()
    }

    return letter
}

function addMoneyField(){
    
}

console.log("Luna Online")
//client.login(process.env.BOT_TOKEN);
client.login(config.BOT_TOKEN);