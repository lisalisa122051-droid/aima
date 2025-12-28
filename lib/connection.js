const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore } = require('@whiskeysockets/baileys');
const { writeFileSync, readFileSync, existsSync } = require('fs');
const { join } = require('path');
const pino = require('pino');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: true,
        markOnlineOnConnect: true,
        generateHighQualityQR: true,
        browser: ['Bot MD', 'Safari', '3.0'],
        syncFullHistory: true,
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id);
                return msg?.message || null;
            }
            return null;
        }
    });

    return sock;
}

module.exports = { connectToWhatsApp };
