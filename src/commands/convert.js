const Game = require('../models/Game');
const embedUtils = require('../utils/embedBuilder');

const defaultCountries = ['FR', 'RU'];

module.exports = async (msg, appId, countries = []) => {
    defaultCountries.filter(country => !countries.includes(country)).forEach(country => countries.push(country));

    const game = new Game.class(appId);
    await game.fetchGameDetails(countries);

    const stateList = Game.getStateList();
    if (!game.isInit()) return msg.reply("\n:x: Une erreur s'est produite pendant la récupération").catch(err => console.error(err));
    else if (game.getState() === stateList.NOT_FOUND) return msg.reply("\n:x: Le jeu demandé est introuvable").catch(err => console.error(err));
    else if (game.getState() === stateList.NO_PRICE) return msg.reply("\n:x: Les informations sur le prix sont introuvables _(Le jeu est peux-être gratuit ?)_").catch(err => console.error(err));

    msg.reply(embedUtils.build(msg, game)).catch(err => console.error(err));
}