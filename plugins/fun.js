const jokes = [
    "Mengapa kucing suka bermain? Karena mereka tidak punya pekerjaan!",
    "Apa yang dikatakan ayam ketika bertelur? 'Telur ini milikku!'",
    "Mengapa komputer sering sakit? Karena terlalu banyak virus!"
];

async function execute(sock, m, store, command) {
    const { from } = m;
    
    if (command === 'joke') {
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        await sock.sendMessage(from, { text: randomJoke }, { quoted: m.m });
    }
    
    if (command === 'tebakgambar') {
        await sock.sendMessage(from, { text: 'Tebak gambar dimulai! (Gambar akan dikirim)' }, { quoted: m.m });
        // Implement image sending logic
    }
    
    if (command === 'truth') {
        const truths = ["Apa rahasia terbesarmu?", "Siapa yang pernah kamu sukai?"];
        await sock.sendMessage(from, { text: truths[Math.floor(Math.random() * truths.length)] }, { quoted: m.m });
    }
    
    if (command === 'dare') {
        const dares = ["Lakukan dance 10 detik", "Kirim voice note menyanyi"];
        await sock.sendMessage(from, { text: dares[Math.floor(Math.random() * dares.length)] }, { quoted: m.m });
    }
    
    if (command === 'rate') {
        const rating = Math.floor(Math.random() * 10) + 1;
        await sock.sendMessage(from, { text: `Rating: ${rating}/10` }, { quoted: m.m });
    }
}

module.exports = { execute };
