const { getBuffer } = require('../lib/function');

async function execute(sock, m, store, command) {
    const { from } = m;
    
    if (command === 'sticker') {
        if (m.quoted && (m.quoted.type === 'imageMessage' || m.quoted.type === 'videoMessage')) {
            const buffer = await getBuffer(m.quoted.content.url);
            await sock.sendMessage(from, { sticker: buffer }, { quoted: m.m });
        } else {
            await sock.sendMessage(from, { text: 'Silakan reply gambar/video dengan .sticker' }, { quoted: m.m });
        }
    }
    
    if (command === 'toimg') {
        if (m.quoted && m.quoted.type === 'stickerMessage') {
            await sock.sendMessage(from, { text: 'Mengonversi ke gambar...' }, { quoted: m.m });
            // Implement conversion logic
        }
    }
    
    if (command === 'toaudio') {
        if (m.quoted && m.quoted.type === 'videoMessage') {
            await sock.sendMessage(from, { text: 'Mengonversi ke audio...' }, { quoted: m.m });
            // Implement conversion logic
        }
    }
    
    if (command === 'shortlink') {
        const url = m.text.split(' ')[1];
        if (url) {
            await sock.sendMessage(from, { text: `Shortlink: https://short.url/${Math.random().toString(36).substr(2, 5)}` }, { quoted: m.m });
        }
    }
}

module.exports = { execute };
