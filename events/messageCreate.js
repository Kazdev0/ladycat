module.exports = {
    name: 'messageCreate',
    async execute(message) {
        const client = message.client;
        if (message.author.bot) return;

        if (!message.content.startsWith(client.config.prefix)) return;

        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.prefixCommands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('Bu komutu çalıştırırken bir hata oluştu.');
        }
    },
};
