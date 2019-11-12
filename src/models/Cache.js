const fetch = require('node-fetch');

module.exports = class Cache {
    constructor() {
        this.rates = {};
        this.steamGames = [];
        
        setInterval(this.refresh, 60 * 60 * 24);
        this.refresh();
    }

    refresh() {
        fetch('https://api.exchangeratesapi.io/latest')
            .then(res => res.json())
            .then(res => {
                this.rates = res.rates;
                this.rates["EUR"] = 1;
            });

        fetch('https://api.steampowered.com/ISteamApps/GetAppList/v0002/')
            .then(res => res.json())
            .then(res => {
                this.steamGames = res.applist.apps;
            });
    }

    getRates() {
        return this.rates;
    }

    getSteamGames() {
        return this.steamGames;
    }
}