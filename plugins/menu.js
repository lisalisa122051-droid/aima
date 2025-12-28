const { getBuffer } = require('../lib/function');
const { config } = require('../config');

async function execute(sock, m, store, command) {
    if (command !== 'menu' && command !== 'allmenu' && command !== 'help') return;
    
    const { from, sender } = m;
    const menuThumbnail = await getBuffer(config.config.menuThumbnail);
    
    if (command === 'menu') {
        const menuButtons = [
            { buttonId: 'allmenu', buttonText: { displayText: 'All Menu' }, type: 1 },
            { buttonId: 'ping', buttonText: { displayText: 'Speed' }, type: 1 },
            { buttonId: 'infobot', buttonText: { displayText: 'Bot Info' }, type: 1 }
        ];
        
        const menuMessage = {
            text: 'Halo! Saya adalah bot WhatsApp. Berikut menu utama:',
            footer: 'Ketik .menu untuk melihat menu',
            buttons: menuButtons,
            headerType: 4,
            image: menuThumbnail
        };
        
        await sock.sendMessage(from, menuMessage, { quoted: m.m });
    }
    
    if (command === 'allmenu' || command === 'help') {
        const sections = [
            {
                title: "Main Menu",
                rows: [
                    { title: "Menu", description: "Tampilkan menu utama", rowId: "menu" },
                    { title: "Ping", description: "Cek kecepatan bot", rowId: "ping" }
                ]
            },
            {
                title: "Download Menu",
                rows: [
                    { title: "Play", description: "Download audio/video", rowId: "play" },
                    { title: "YT Video", description: "Download YouTube video", rowId: "ytvideo" }
                ]
            }
        ];
        
        const listMessage = {
            text: "Silakan pilih menu yang diinginkan:",
            footer: "Ketik .allmenu untuk melihat semua menu",
            title: "List Menu",
            buttonText: "Menu",
            sections
        };
        
        await sock.sendMessage(from, listMessage, { quoted: m.m, thumbnail: menuThumbnail });
    }
}

module.exports = { execute };
