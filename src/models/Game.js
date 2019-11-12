const fetch = require('node-fetch');
const getSymbolFromCurrency = require('currency-symbol-map');
const stringSimilarity = require('string-similarity');
const rate = require('../utils/moneyConvert');
const cacheManager = require('../utils/cacheManager');

const STATE = {
    PENDING: -3,
    NOT_FOUND: -2,
    NO_PRICE: -1,
    FOUND: 1
}

exports.class = class Game {
    constructor(appId) {
        this.appId = appId;
        this.state = STATE.PENDING;
        this.gameInfos = {};
    }

    async fetchGameDetails(countryCode) {
        const proms = [];
        countryCode.forEach(cc => proms.push(fetch(this.getURL(cc)).then(res => res.json())));

        const resList = (await Promise.all(proms)).map(i => i[this.appId].data).filter(i => i != null);

        if (resList.length == 0) return this.state = STATE.NOT_FOUND;
        if (!resList[0].price_overview) return this.state = STATE.NO_PRICE;

        this.gameInfos.name = resList[0].name;
        this.gameInfos.header_image = resList[0].header_image;
        this.gameInfos.currency = {};

        resList.forEach(res => {
            const typeCurrency = res.price_overview.currency;
            const currentPrice = res.price_overview.final / 100;

            this.gameInfos.currency[typeCurrency] = {
                currentPrice: currentPrice,
                priceFormat: getSymbolFromCurrency(typeCurrency)
            };
        });

        const currencyList = Object.keys(this.gameInfos.currency);
        this.gameInfos.diffCurrency = {};

        for (let curBase of currencyList) {
            this.gameInfos.diffCurrency[curBase] = {};

            for (let curDiff of currencyList) {
                if (curBase === curDiff) continue;

                this.gameInfos.diffCurrency[curBase][curDiff] = rate.convert(this.gameInfos.currency[curBase].currentPrice, curBase, curDiff);
            }
        }

        this.state = STATE.FOUND;
    }

    static getAppIdByName(name) {
        const gamesName = cacheManager.getSteamGames().map(i => i.name.toLowerCase());
        const matches = stringSimilarity.findBestMatch(name, gamesName);
        const index = gamesName.indexOf(matches.bestMatch.target);
        return [matches, cacheManager.getSteamGames()[index].appid];
    }

    getGameInfos() {
        return this.gameInfos;
    }

    getState() {
        return this.state;
    }

    getURL(cc) {
        return `https://store.steampowered.com/api/appdetails?appids=${this.appId}&cc=${cc}`;
    }

    isInit() {
        return this.state != STATE.PENDING;
    }
}

exports.getStateList = () => {
    return STATE;
}