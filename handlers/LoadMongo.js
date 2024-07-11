const mongoose = require('mongoose');
const chalk = require('chalk');

async function LoadMongo(client) {
    try {
        await mongoose.connect('mongodb://localhost:27017/', {
        });
        console.log(chalk.yellow(`[${client.config.chalk}] `) + chalk.cyan('[DB] ') + chalk.green('MongoDB connection true.'))
    } catch (error) {
        console.error('MongoDB bağlantı hatası:', error);
    }
}

module.exports = LoadMongo;
