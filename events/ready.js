const { ActivityType } = require('discord.js');
const chalk = require('chalk');
const axios = require('axios');
const cron = require('node-cron');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        const apiKey = client.config.DPlaceAPI;
        console.log(chalk.yellow(`[${client.config.chalk}] `) + chalk.cyan('[BOT] ') + chalk.green('Bot is up!'));

        client.user.setActivity(`${client.config.status}`, { type: ActivityType.Custom });
        client.user.setStatus('online');
    },
};
