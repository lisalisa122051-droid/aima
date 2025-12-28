const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi;

async function execute(sock, m, store, command) {
    const { from, isGroup, sender } = m;
    if (!isGroup) return;
    
    // Admin check logic would be here
    const isAdmin = true; // Implement actual admin check
    
    if (command === 'antilink' && m.text.split(' ')[1]) {
        const status = m.text.split(' ')[1].toLowerCase();
        await sock.sendMessage(from, { text: `Antilink ${status === 'on' ? 'activated' : 'deactivated'}` }, { quoted: m.m });
        return;
    }
    
    if (m.text.match(linkRegex) && !isAdmin) {
        await sock.sendMessage(from, { text: `@${sender.split('@')[0]} mengirim link!`, mentions: [sender] }, { quoted: m.m });
        await sock.groupParticipantsUpdate(from, [sender], 'remove');
    }
}

module.exports = { execute };
