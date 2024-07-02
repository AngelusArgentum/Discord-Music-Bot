const { getVoiceConnection } = require('@discordjs/voice');
const { joinVoiceChannelSingleton, getConnection } = require('..//modules/voiceManager');
const getVideoTitle = require('../utils/youtubeFuncs');

module.exports = {
    name: 'play',
    description: 'Plays a song from a YouTube URL',
    async execute (message){
        userInVoiceChannel=message.member.voice.channel;

        if(userInVoiceChannel){
            try{
                botVoiceConnection = getVoiceConnection(message.guild.id);
                if (!botVoiceConnection){
                    botConnectVoice(message, userInVoiceChannel);
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
};

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
    joinVoiceChannelSingleton(
        message.guild.id, userInVoiceChannel.id, message.guild.voiceAdapterCreator
    );
    message.channel.send(`Me uní a ${userInVoiceChannel.name} <3.`);
    addVideo(message);
}