const apps = require('../apps');
const config = require('../../config.json');
const cacheManager = require('../utils/cacheManager');

module.exports = (msg) => {
    if (msg.author.id == apps.getClient().user.id) return;
    if (!cacheManager.isInit()) return;

    const content = msg.content.slice(config.discord.prefix.length).trim();
    const splitLength = content.split(" ").length;

    if (!msg.content.startsWith(config.discord.prefix))
        require('./grabAppId').cmd(msg, content);
    else if (content.length >= 1 && splitLength >= 1)
        require('./getGame')(msg, content);
    else
        msg.reply(`:x: Format : \` ${config.discord.prefix}<Nom de jeu | Steam URL> [; <pays, ...>]\``);
}