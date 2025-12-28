const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

function makeInMemoryDatabase(filePath) {
    let data = {};
    
    const load = () => {
        if (existsSync(filePath)) {
            try {
                data = JSON.parse(readFileSync(filePath, 'utf-8'));
            } catch (e) {
                console.error('Error loading database:', e);
                data = {};
            }
        }
    };

    const save = () => {
        writeFileSync(filePath, JSON.stringify(data, null, 2));
    };

    const get = (key) => {
        return data[key] || null;
    };

    const set = (key, value) => {
        data[key] = value;
        save();
    };

    const has = (key) => {
        return key in data;
    };

    load();
    
    return {
        get,
        set,
        has,
        save,
        data
    };
}

module.exports = { makeInMemoryDatabase };
