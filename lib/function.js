const axios = require('axios');
const { Buffer } = require('buffer');

async function getBuffer(url) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer'
        });
        return Buffer.from(response.data, 'binary');
    } catch (e) {
        throw new Error(`Error fetching buffer: ${e.message}`);
    }
}

function generateMenuThumbnail() {
    return {
        url: 'https://i.imgur.com/9i1GZ1m.jpg'
    };
}

module.exports = {
    getBuffer,
    generateMenuThumbnail
};
