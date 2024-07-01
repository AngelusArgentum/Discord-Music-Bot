require('dotenv').config();
const { Client, IntentsBitField} = require('discord.js'); //Importar funciones de Discord.js.
const getVideoTitle = require('./youtubeFuncs'); //Importar funcion de YouTube V3.
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice'); //Importar funciones de canal de voz.
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates
    ],
});

client.on('ready', (c) => {
    console.log(`Loggeado como ${client.user.tag}!`)
});

client.on('messageCreate', async (message) =>{
    
    if (message.content.startsWith('--play ')){
        userInVoiceChannel=message.member.voice.channel;

        if(userInVoiceChannel){
            try{
                botVoiceConnection = getVoiceConnection(message.guild.id);
                if (!botVoiceConnection){
                    connection = botConnectVoice(message, userInVoiceChannel);
                }
                else{
                    botAlreadyConnected(message, userInVoiceChannel, botVoiceConnection);
                }
            }
            catch(error){
                console.error("No pude unirme al canal de voz: ", error);
                message.channel.send("No pude unirme al canal de voz.");
            }
        }
        else{
            message.channel.send("Tenés que estar en un canal de voz para ejecutar este comando.");
        }
    }
});

client.login(process.env.TOKEN);

async function addVideo (message){
    const videoUrl=message.content.split(' ')[1];
    const videoTitle=await getVideoTitle(videoUrl);
    if (videoTitle){
        message.channel.send(`Proveyó la URL de ${videoTitle}.`);
    }
    else{
        message.channel.send('Debe proporcionar una URL válida.');
    }
}

function botAlreadyConnected(message, userInVoiceChannel, botVoiceConnection){
    const botChannelId = botVoiceConnection.joinConfig.channelId;
    if (userInVoiceChannel.id === botChannelId){
        message.channel.send("Estamos en el mismo canal owo.");
        addVideo(message);
    }
    else{
        message.channel.send("Ya estoy en otro canal de voz, no me molestes unu.");
    }
}

function botConnectVoice (message, userInVoiceChannel){
    const connection = joinVoiceChannel({
        channelId: userInVoiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    });
    message.channel.send(`Me uní a ${userInVoiceChannel.name} <3.`);
    addVideo(message);
    return connection;
}
// TODO: create queue, !skip, !queue, !stop, !look.