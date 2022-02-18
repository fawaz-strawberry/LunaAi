const Discord = require('discord.js');
const config = require("./config.json");

const client = new Discord.Client({intents:["GUILDS", "GUILD_MESSAGES"]});
const prefix = ".";

GITHUB_API = "https://api.github.com/repos/fawaz-strawberry/"
ADD_FILE = "LunaAi/contents/"

client.on("messageCreate", function(message) {
    if (message.author.bot) return;
    if(!message.content.startsWith(prefix)) {
        if(message.content.indexOf("420") != -1)
        {
            message.reply("Someone say 420?\nhttps://www.google.com/url?sa=i&url=https%3A%2F%2Fgfycat.com%2Ficyincomparablecricket&psig=AOvVaw0_SI4Qn1KPljDxhUJMXNb_&ust=1645300883382000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCOCrmciFivYCFQAAAAAdAAAAABAN")
        }
        else
        {
            return
        }
    };
    
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if(command === "ping"){
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
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

    // if(command === "profile")
    // {
    //     var request = new XMLHttpRequest();

    //     request.open('put', GITHUB_API + ADD_FILE)

    //     request
    // }
});

console.log("Luna Online")
client.login(process.env.BOT_KEY);

// bot.login(TOKEN);

// bot.on('ready', () => {
//   console.info(`Logged in as ${bot.user.tag}!`);
// });

// bot.on('message', msg => {
//   if (msg.content === 'ping') {
//     msg.reply('pong');
//     msg.channel.send('pong');

//   } else if (msg.content.startsWith('!kick')) {
//     if (msg.mentions.users.size) {
//       const taggedUser = msg.mentions.users.first();
//       msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
//     } else {
//       msg.reply('Please tag a valid user!');
//     }
//   }
// });
