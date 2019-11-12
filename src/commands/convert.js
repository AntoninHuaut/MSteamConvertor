const Game = require('../models/Game');
const embedUtils = require('../utils/embedBuilder');

const defaultCountries = ['FR', 'RU'];

module.exports = async (msg, appId, countries = []) => {
    defaultCountries.filter(country => !countries.includes(country)).forEach(country => countries.push(country));

    const game = new Game(appId);
    await game.fetchGameDetails(countries);

    if (!game.isInit())
        return msg.reply("\n:x: Les informations du jeu n'ont pas pu être récupérées").catch(err => console.error(err));

    msg.reply(embedUtils.build(msg, game)).catch(err => console.error(err));
}