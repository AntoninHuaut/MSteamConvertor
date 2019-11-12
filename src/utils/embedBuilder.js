const Discord = require('discord.js');
const client = require('../apps').getClient();

exports.build = (msg, game) => {
    const gameInfos = game.gameInfos;

    let priceMsg = '';
    let keys = Object.keys(gameInfos.currency).sort(sortCurrency);

    keys.forEach(curBase => {
        const pInfos = gameInfos.currency[curBase];
        priceMsg += `\n**${curBase}** : ${pInfos.currentPrice} ${pInfos.priceFormat}`;

        if (curBase !== 'EUR') {
            let price = gameInfos.diffCurrency[curBase]["EUR"];
            price = Math.round(price * 100) / 100;
            priceMsg += ` _(${price} €)_`;
        }
    });

    const embed = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setDescription(priceMsg)
        .setImage(gameInfos.header_image)
        .setAuthor(gameInfos.name, client.user.avatarURL, `https://store.steampowered.com/app/${game.appId}`)
        .setFooter(msg.author.tag, msg.author.avatarURL)
        .setTimestamp();

    keys = Object.keys(gameInfos.diffCurrency).sort(sortCurrency);
    keys.forEach(curBase => {
        if (curBase == 'EUR') return;

        let diff = gameInfos.currency["EUR"].currentPrice - gameInfos.diffCurrency[curBase]["EUR"];
        diff = Math.round(diff * 100) / 100;

        embed.addField(curBase, `Économie de **${diff} €**`, true);
    });

    return embed;
}

function sortCurrency(a, b) {
    if (a == 'EUR') return -1;
    return a.localeCompare(b)
}