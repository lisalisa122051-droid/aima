function isGroupJid(jid) {
    return jid.endsWith('@g.us');
}

function extractPhoneFromJid(jid) {
    return jid.split('@')[0];
}

function normalizePhoneNumber(number) {
    if (number.startsWith('0')) {
        return '62' + number.slice(1);
    }
    if (number.startsWith('+')) {
        return number.slice(1);
    }
    return number;
}

function mapRawJidToOriginalNumber(jid) {
    const [user] = jid.split('@');
    return normalizePhoneNumber(user);
}

function processJidFromGroupMessage(participant) {
    return mapRawJidToOriginalNumber(participant);
}

function jidNormalizedUser(jid) {
    if (!jid) return '';
    const user = jid.split('@')[0];
    return normalizePhoneNumber(user);
}

function isOwner(sender, ownerNumbers) {
    const normalizedSender = jidNormalizedUser(sender);
    return ownerNumbers.some(owner => normalizedSender === owner);
}

module.exports = {
    isGroupJid,
    extractPhoneFromJid,
    normalizePhoneNumber,
    mapRawJidToOriginalNumber,
    processJidFromGroupMessage,
    jidNormalizedUser,
    isOwner
};
