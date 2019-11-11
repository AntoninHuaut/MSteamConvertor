const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../config');
const commands = require("./commands");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', commands);
client.login(config.discord.token);

exports.getClient = () => {
    return client;
}