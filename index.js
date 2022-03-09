const Discord = require('discord.js');
const config = require("./config.json");
const fetch = require('node-fetch');
const BlackJack = require("./blackjack")
const { Octokit } = require("@octokit/core");

//const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const octokit = new Octokit({ auth: config.GITHUB_TOKEN });

const client = new Discord.Client({intents:["GUILDS", "GUILD_MESSAGES"]});
const prefix = ".";

var user_sha = ""
var user_data = ""

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
        if(message.content.toLowerCase().indexOf("loser") != -1)
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
        var table = BlackJack()
        var status = table.catchTheseHands()

        message.reply(status)

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
                    message.reply("Hello " + message.author.username + "!")
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
    user_data[author.id] = {"profile_pic":author.avatarURL(), "Description":"New User", "Money":200, "Level":1}
    console.log(user_data)
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



console.log("Luna Online")
//client.login(process.env.BOT_TOKEN);
client.login(config.BOT_TOKEN);