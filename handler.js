const { config } = require('./config');
const { jidNormalizedUser, isOwner } = require('./lib/jidUtils');
const { makeInMemoryDatabase } = require('./lib/database');
const { getBuffer } = require('./lib/function');
const { serialize } = require('./lib/serialize');

const database = makeInMemoryDatabase(config.config.databaseFile);

async function handler(sock, m, store) {
    try {
        const { text, sender, from, isGroup, groupMetadata } = m;
        const normalizedSender = jidNormalizedUser(sender);
        const isCmd = config.config.prefix.some(prefix => text?.startsWith(prefix));
        const command = isCmd ? text.slice(1).trim().split(' ')[0].toLowerCase() : '';
        
        // WhatsApp Business Message Logic
        if (!database.has(normalizedSender)) {
            database.set(normalizedSender, { businessMessageSent: false });
            await database.save();
        }
        
        if (!database.get(normalizedSender).businessMessageSent) {
            await sock.sendMessage(sender, { text: config.config.businessMessage });
            database.get(normalizedSender).businessMessageSent = true;
            await database.save();
        }

        if (!isCmd) return;

        // Plugin loading
        const plugins = [
            './plugins/menu',
            './plugins/ping',
            './plugins/infobot',
            './plugins/owner',
            './plugins/group',
            './plugins/fun',
            './plugins/download',
            './plugins/tools',
            './plugins/antilink'
        ];

        for (const plugin of plugins) {
            const { execute } = require(plugin);
            if (execute && typeof execute === 'function') {
                await execute(sock, m, store, command);
            }
        }
    } catch (e) {
        console.error('Handler error:', e);
    }
}

module.exports = { handler };
