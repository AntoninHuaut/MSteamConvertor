const fetch = require('node-fetch');
const FORMAT = {
    FR: "€",
    RU: "pуб"
}

module.exports = class Game {
    constructor(appId, rate) {
        this.appId = appId;
        this.rate = rate;
        this.gameInfos = {};
        this.init = false;
    }

    getGameInfos() {
        return this.gameInfos;
    }

    isInit() {
        return this.init;
    }

    async fetchGameDetails(countryCode) {
        const proms = [];
        countryCode.forEach(cc => proms.push(fetch(this.getURL(cc)).then(res => res.json())));

        const resList = (await Promise.all(proms)).map(i => i[this.appId].data).filter(i => i != null);

        if (resList.length == 0) return;
        if (!resList[0].price_overview) return;

        this.gameInfos.name = resList[0].name;
        this.gameInfos.currency = {};

        resList.forEach(res => {
            const typeCurrency = res.price_overview.currency;
            const currentPrice = res.price_overview.final / 100;

            this.gameInfos.currency[typeCurrency] = {
                currentPrice: currentPrice,
                priceFormat: FORMAT[countryCode[resList.indexOf(res)]]
            };
        });

        const currencyList = Object.keys(this.gameInfos.currency);
        this.gameInfos.diffCurrency = {};

        for (let curBase of currencyList) {
            this.gameInfos.diffCurrency[curBase] = {};

            for (let curDiff of currencyList) {
                if (curBase === curDiff) continue;

                this.gameInfos.diffCurrency[curBase][curDiff] = this.rate.convert(this.gameInfos.currency[curBase].currentPrice, curBase, curDiff);
            }
        }

        this.init = true;
    }

    getURL(cc) {
        return `https://store.steampowered.com/api/appdetails?appids=${this.appId}&cc=${cc}`;
    }
}