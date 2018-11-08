const strip = require('strip-comments');
const fs = require('fs');

const getConfig = (path = './config/client.js') => {
    const config = fs.readFileSync(path).toString();
    return JSON.parse(strip(config.trim(), {safe: false}).replace(/^export\sdefault/, ''));
};

module.exports = getConfig