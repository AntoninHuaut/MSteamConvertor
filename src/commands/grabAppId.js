const convert = require('./convert');
const appRegex = /[0-9]+/g;

module.exports = async (msg, content, countries = []) => {
    content = content || msg.content;
    let resRegex = content.match(appRegex);

    if (!content.includes('store.steampowered.com') || resRegex.length == 0) return;

    let appId = resRegex[0];
    convert(msg, appId, countries);
}