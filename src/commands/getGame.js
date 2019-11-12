const Game = require('../models/Game');
const grabAppId = require('./grabAppId');
const convert = require('./convert');

const RATE_MIN = 0.6;

module.exports = async (msg, cutContent) => {
    const contentSplit = cutContent.split(';');
    let countries = [];

    if (contentSplit.length > 1) {
        const countriesSplit = contentSplit[1].split(" ");
        for (let i = 0; i < countriesSplit.length; i++)
            countries.push(countriesSplit[i]);
    }

    let gameKey = contentSplit[0];

    let appId = grabAppId.getAppIdByURL(gameKey);

    if (!appId) {
        let res = Game.getAppIdByName(gameKey);
        let bestMatch = res[0].bestMatch;

        if (bestMatch.rating < RATE_MIN)
            return msg.reply(":x: Le jeu demandé est introuvable");

        appId = res[1];
    }

    convert(msg, appId, countries);
}