const config = require('../../config.json');

module.exports = (msg) => {
    const content = msg.content.slice(config.discord.prefix.length).trim();

    if (!msg.content.startsWith(config.discord.prefix))
        require('./grabAppId')(msg);
    else
        require('./cmdConvert')(msg, content);
}