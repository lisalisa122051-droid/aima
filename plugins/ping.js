const { performance } = require('perf_hooks');

async function execute(sock, m, store, command) {
    if (command !== 'ping' && command !== 'speed' && command !== 'runtime') return;
    
    const { from } = m;
    const start = performance.now();
    
    if (command === 'ping' || command === 'speed') {
        const end = performance.now();
        const speed = (end - start).toFixed(2);
        await sock.sendMessage(from, { text: `Pong! Kecepatan: ${speed}ms` }, { quoted: m.m });
    }
    
    if (command === 'runtime') {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        await sock.sendMessage(from, { 
            text: `Bot aktif selama: ${hours}h ${minutes}m ${seconds}s` 
        }, { quoted: m.m });
    }
}

module.exports = { execute };
