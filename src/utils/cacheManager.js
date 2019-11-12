const Cache = require('../models/Cache');
const cache = new Cache();

exports.isInit = () => {
    return cache.getSteamGames().length && Object.keys(cache.getRates()).length;
}

exports.getRates = () => {
    return cache.getRates();
}

exports.getSteamGames = () => {
    return cache.getSteamGames();
}