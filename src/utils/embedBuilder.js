const Discord = require('discord.js');
const client = require('../apps').getClient();

exports.build = (msg, game) => {
    const gameInfos = game.gameInfos;

    let priceMsg = '';
    Object.keys(gameInfos.currency).forEach(curBase => {
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

    Object.keys(gameInfos.diffCurrency).forEach(curBase => {
        if (curBase == 'EUR') return;

        let diff = gameInfos.currency["EUR"].currentPrice - gameInfos.diffCurrency[curBase]["EUR"];
        diff = Math.round(diff * 100) / 100;

        embed.addField(curBase, `Économie de **${diff} €**`, true);
    });

    return embed;
}