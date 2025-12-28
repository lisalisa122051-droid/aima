const { Boom } = require('@hapi/boom');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore } = require('@whiskeysockets/baileys');
const { writeFileSync, readFileSync, existsSync } = require('fs');
const { join } = require('path');
const { serialize } = require('./lib/serialize');
const { makeInMemoryDatabase } = require('./lib/database');
const { jidNormalizedUser } = require('./lib/jidUtils');
const { handler } = require('./handler');
const { config } = require('./config');

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
store.readFromFile('./database.json');

async function startBot() {
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

    store.bind(sock.ev);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Connection closed. Reconnecting...');
                startBot();
            } else {
                console.log('Connection closed. Bot logged out.');
            }
        } else if (connection === 'open') {
            console.log('Bot connected successfully');
        }
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            for (const msg of messages) {
                if (!msg.message) return;
                const m = serialize(sock, msg);
                if (!m) return;
                await handler(sock, m, store);
            }
        } catch (e) {
            console.error('Error handling message:', e);
        }
    });

    sock.ev.on('group-participants.update', async (update) => {
        if (update.participants.length === 0) return;
        const groupMetadata = await sock.groupMetadata(update.id);
        const participants = update.participants.map(p => jidNormalizedUser(p));
        
        if (update.action === 'add') {
            for (const participant of participants) {
                const welcomeMessage = `Halo @${participant.split('@')[0]}!\nSelamat datang di grup ${groupMetadata.subject}`;
                await sock.sendMessage(update.id, {
                    text: welcomeMessage,
                    mentions: [participant]
                });
            }
        }
    });

    return sock;
}

startBot();
