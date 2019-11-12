const {
    Cashify
} = require('cashify');
const cacheManager = require('./cacheManager');

exports.convert = (amount, from, to) => {
    try {
        return getCashify().convert(amount, {
            from: from,
            to: to
        });
    } catch (err) {
        console.log(`unknow ${from} to ${to}`)
        return "N/A";
    }
}

function getCashify() {
    const rates = cacheManager.getRates();
    return new Cashify({
        base: 'EUR',
        rates
    });
}