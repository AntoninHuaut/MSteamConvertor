const grabAppId = require('./grabAppId');
const config = require('../../config.json');

module.exports = async (msg, content) => {
    const contSplit = content.split(' ');
    if (!content || contSplit.length < 2) return msg.reply(`:x: Format: \`${config.discord.prefix}<pays, ...> <url>\``);

    let countries = [];

    for (let i = 0; i < contSplit.length - 1; i++)
        countries.push(contSplit[i]);

    let url = contSplit[contSplit.length - 1];

    grabAppId(msg, url, countries);
}