const { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { joinVoiceChannelSingleton, getConnection } = require('../modules/voiceManager');
const getVideoTitle = require('../utils/youtubeFuncs');
const ytdl = require('ytdl-core');

module.exports = {
    name: 'play',
    description: 'Plays a song from a YouTube URL',
    async execute (message, queue){
        userInVoiceChannel=message.member.voice.channel;
        if(userInVoiceChannel){
            try{
                botVoiceConnection = getVoiceConnection(message.guild.id);
                if (!botVoiceConnection){
                    botConnectVoice(message, userInVoiceChannel, queue);
                }
                else{
                    botAlreadyConnected(message, userInVoiceChannel, botVoiceConnection, queue);
                }
                playVideo(queue, message);
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



function playVideo (queue, message){
    const connection=getConnection();
    console.log("conexion");
    connection.on(VoiceConnectionStatus.Ready, async () =>{
        if (queue.length > 0){
            console.log("queue no empty:");
            const url = queue.shift();
            const stream = ytdl(url, {filter: 'audioonly'});
            const resource = createAudioResource(stream);
            const player = createAudioPlayer();
            console.log("URL:");
            const videoTitle = await getVideoTitle(url);

            player.play(resource);
            connection.subscribe(player);
            console.log("recurso y player:");
            player.once(AudioPlayerStatus.Playing,() => {
                message.channel.send(`Ahora suena: ${videoTitle}.`);
            })
            player.on(AudioPlayerStatus.Idle, () =>{
                if(queue.length > 0){
                    playVideo(queue, message);
                }
                else{
                    connection.destroy();
                    message.channel.send("Me voy porque me odiás (no hay más canciones).")
                }
            })
        }
    })
}

async function addVideo (message, queue){
    const videoUrl=message.content.split(' ')[1];
    const videoTitle=await getVideoTitle(videoUrl);
    if (videoTitle){
        queue.push(videoUrl);
        message.channel.send(`${videoTitle} se agregó a la lista de reproducción.`);
    }
    else{
        message.channel.send('Debe proporcionar una URL válida.');
    }
}

async function botAlreadyConnected(message, userInVoiceChannel, botVoiceConnection, queue){
    const botChannelId = botVoiceConnection.joinConfig.channelId;
    if (userInVoiceChannel.id === botChannelId){
        message.channel.send("Estamos en el mismo canal owo.");
        await addVideo(message, queue);
    }
    else{
        message.channel.send("Ya estoy en otro canal de voz, no me molestes unu.");
    }
}

async function botConnectVoice (message, userInVoiceChannel, queue){
    joinVoiceChannelSingleton(
        message.guild.id, userInVoiceChannel.id, message.guild.voiceAdapterCreator
    );
    message.channel.send(`Me uní a ${userInVoiceChannel.name} <3.`);
    await addVideo(message, queue);
}