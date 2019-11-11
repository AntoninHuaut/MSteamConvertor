const Game = require('../utils/Game');
const rate = new(require('../utils/Rate'))();
const appRegex = /[0-9]+/g;

module.exports = async (msg) => {
    const content = msg.content;
    let resRegex = content.match(appRegex);

    if (!content.includes('store.steampowered.com') || resRegex.length == 0) return;

    let appId = resRegex[0];

    const game = new Game(appId, rate);
    await game.fetchGameDetails(["FR", "RU"]);

    const gameInfo = game.getGameInfos();

    if (!game.isInit())
        return msg.reply("\n:x: Les informations du jeu n'ont pas pu être récupérées").catch(err => console.error(err));;

    let msgFinal = `\n:information_source: **${gameInfo.name}**`;

    Object.keys(gameInfo.currency).forEach(curBase => {
        const pInfos = gameInfo.currency[curBase];
        msgFinal += `\n**${curBase}** : ${pInfos.currentPrice} ${pInfos.priceFormat}`;

        if (curBase !== 'EUR') {
            let price = gameInfo.diffCurrency[curBase]["EUR"];
            price = Math.round(price * 100) / 100;
            msgFinal += ` _(${price} €)_`;
        }
    });

    let diff = gameInfo.currency["EUR"].currentPrice - gameInfo.diffCurrency["RUB"]["EUR"];
    diff = Math.round(diff * 100) / 100;

    msgFinal += `\n\nSoit une économie de **${diff} €**`;

    msg.reply(msgFinal).catch(err => console.error(err));
}