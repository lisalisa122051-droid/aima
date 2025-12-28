const { isGroupJid } = require('../lib/jidUtils');

async function execute(sock, m, store, command) {
    const { from, sender, isGroup } = m;
    if (!isGroup) return;
    
    // Admin check logic would be here
    const isAdmin = true; // Implement actual admin check
    
    if (!isAdmin) return;
    
    if (command === 'welcome' && m.text.split(' ')[1]) {
        const status = m.text.split(' ')[1].toLowerCase();
        await sock.sendMessage(from, { text: `Welcome message ${status === 'on' ? 'activated' : 'deactivated'}` }, { quoted: m.m });
    }
    
    if (command === 'setname') {
        const newName = m.text.slice(7).trim();
        if (newName) {
            await sock.groupUpdateSubject(from, newName);
            await sock.sendMessage(from, { text: `Nama grup diubah menjadi: ${newName}` }, { quoted: m.m });
        }
    }
    
    if (command === 'open') {
        await sock.groupSettingUpdate(from, 'not_announcement');
        await sock.sendMessage(from, { text: 'Grup dibuka untuk semua anggota' }, { quoted: m.m });
    }
    
    if (command === 'close') {
        await sock.groupSettingUpdate(from, 'announcement');
        await sock.sendMessage(from, { text: 'Grup ditutup, hanya admin yang bisa kirim pesan' }, { quoted: m.m });
    }
    
    if (command === 'kick' && m.quoted) {
        const user = m.quoted.sender;
        await sock.groupParticipantsUpdate(from, [user], 'remove');
        await sock.sendMessage(from, { text: `@${user.split('@')[0]} telah dikeluarkan dari grup` }, { quoted: m.m, mentions: [user] });
    }
}

module.exports = { execute };
