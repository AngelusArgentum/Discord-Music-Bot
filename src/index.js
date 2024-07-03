require('dotenv').config();
const { Client, IntentsBitField, Collection} = require('discord.js'); //Importar funciones de Discord.js.
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates
    ],
});

const queue = [];

client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', (c) => {
    console.log(`Loggeado como ${client.user.tag}!`)
});

client.on('messageCreate', async (message) =>{
    if (!message.content.startsWith('--') || message.author.bot) return;
    
    args = message.content.slice(2).trim().split(' ');
    commandName = args.shift().toLowerCase();

    command = client.commands.get(commandName);
    if (!command) return;
    try {
        await command.execute(message, queue);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

client.login(process.env.TOKEN);


// TODO: create queue, !skip, !queue, !stop, !search, repositorio para cada case.