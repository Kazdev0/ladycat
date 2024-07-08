const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Test')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const member = await interaction.guild.members.cache.get(interaction.targetId)
        const userId = interaction.targetId;
        interaction.reply(`${userId}`)
    }
}