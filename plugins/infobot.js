const { config } = require('../config');

async function execute(sock, m, store, command) {
    if (command !== 'infobot' && command !== 'botinfo' && command !== 'about') return;
    
    const { from } = m;
    const botInfo = `
*Bot Information*
- Name: WhatsApp MD Bot
- Version: 1.0.0
- Owner: ${config.config.owner.join(', ')}
- Mode: Multi-Device
- Runtime: ${Math.floor((Date.now() - config.config.runtime) / 1000)} seconds
- Features: Menu, Download, Group, Tools
    `;
    
    await sock.sendMessage(from, { text: botInfo }, { quoted: m.m });
}
module.exports = { execute };
