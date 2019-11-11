const {
    Cashify
} = require('cashify');
const fetch = require('node-fetch');

module.exports = class Rate {
    constructor() {
        this.rates = {};
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
    }

    getRates() {
        return this.rates;
    }

    convert(amount, from, to) {
        return this.getCashify().convert(amount, {
            from: from,
            to: to
        });
    }

    getCashify() {
        const rates = this.rates;
        return new Cashify({
            base: 'EUR',
            rates
        });
    }
}