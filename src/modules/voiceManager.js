const { joinVoiceChannel } = require('@discordjs/voice');

let connection = null;

function joinVoiceChannelSingleton(guildId, channelId, adapterCreator) {
    if (!connection) {
        connection = joinVoiceChannel({
            channelId: channelId,
            guildId: guildId,
            adapterCreator: adapterCreator
        });
    }
    return connection;
}

function getConnection() {
    return connection;
}

function setConnection(c){
    connection=c;
}

module.exports = {
    joinVoiceChannelSingleton,
    getConnection,
    setConnection
};