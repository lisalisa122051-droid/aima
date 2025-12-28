const { config } = require('../config');
const { isOwner } = require('../lib/jidUtils');

async function execute(sock, m, store, command) {
    const { from, sender } = m;
    if (!isOwner(sender, config.config.owner)) return;
    
    if (command === 'owner') {
        await sock.sendMessage(from, { text: `Owner: ${config.config.owner.join(', ')}` }, { quoted: m.m });
    }
    
    if (command === 'self') {
        await sock.sendMessage(from, { text: 'Mode self aktif' }, { quoted: m.m });
        // Implement self mode logic
    }
    
    if (command === 'public') {
        await sock.sendMessage(from, { text: 'Mode public aktif' }, { quoted: m.m });
        // Implement public mode logic
    }
    
    if (command === 'restart') {
        await sock.sendMessage(from, { text: 'Bot sedang restart...' }, { quoted: m.m });
        process.exit();
    }
    
    if (command === 'eval') {
        try {
            const code = m.text.slice(5).trim();
            const result = eval(code);
            await sock.sendMessage(from, { text: `Result: ${JSON.stringify(result)}` }, { quoted: m.m });
        } catch (e) {
            await sock.sendMessage(from, { text: `Error: ${e.message}` }, { quoted: m.m });
        }
    }
}

module.exports = { execute };
