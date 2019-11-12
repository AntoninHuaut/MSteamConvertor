const convert = require('./convert');
const appRegex = /[0-9]+/g;

exports.cmd = async (msg, content) => {
    let appId = this.getAppIdByURL(content);
    if (!appId) return;

    convert(msg, appId);
}

exports.getAppIdByURL = (content) => {
    let resRegex = content.match(appRegex);
    if (!content.includes('store.steampowered.com') || resRegex.length == 0) return;
    return resRegex[0];
}