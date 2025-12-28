const { jidNormalizedUser, isGroupJid, processJidFromGroupMessage } = require('./jidUtils');
const { getBuffer } = require('./function');

function serialize(sock, m) {
    if (!m.message) return null;
    
    const message = m.message;
    const type = Object.keys(message)[0];
    const content = message[type];
    
    const from = m.key.remoteJid;
    const sender = m.key.fromMe ? sock.user.id : (m.key.participant || m.key.remoteJid);
    const isGroup = isGroupJid(from);
    const groupMetadata = isGroup ? sock.groupMetadata(from) : null;
    
    let text = (type === 'conversation' && content) || 
               (type === 'extendedTextMessage' && content.text) || 
               (type === 'imageMessage' && content.caption) || 
               (type === 'videoMessage' && content.caption) || 
               '';
    
    const quoted = {
        isQuoted: false,
        sender: null,
        text: null,
        type: null,
        content: null
    };
    
    if (m.message.extendedTextMessage?.contextInfo?.quotedMessage) {
        quoted.isQuoted = true;
        quoted.sender = jidNormalizedUser(m.message.extendedTextMessage.contextInfo.participant);
        quoted.type = Object.keys(m.message.extendedTextMessage.contextInfo.quotedMessage)[0];
        quoted.content = m.message.extendedTextMessage.contextInfo.quotedMessage[quoted.type];
        quoted.text = quoted.content.text || quoted.content.caption || '';
    }
    
    return {
        key: m.key,
        message: m.message,
        type,
        content,
        from,
        sender: jidNormalizedUser(sender),
        isGroup,
        groupMetadata,
        text,
        quoted,
        pushName: m.pushName,
        m
    };
}

module.exports = { serialize };
