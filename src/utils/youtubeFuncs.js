require('dotenv').config();

const axios = require('axios');

async function getVideoTitle(videoUrl) {
    try {
        const videoId = new URL(videoUrl).searchParams.get('v');
        if (!videoId) {
            throw new Error('ID del video no encontrado en la URL.');
        }

        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet',
                id: videoId,
                key: process.env.APIKEY
            }
        });

        const videoTitle = response.data.items[0].snippet.title;
        return videoTitle;
    } catch (error) {
        console.error('Error al obtener el título del video:', error.message);
        return null;
    }
}

module.exports = getVideoTitle;

// module.exports = {
//     getVideoTitle,
//     otraFuncion
// };