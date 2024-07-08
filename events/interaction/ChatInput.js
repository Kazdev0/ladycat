module.exports = async function ChatInputInteraction(interaction) {
    const command = interaction.client.slashCommands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return interaction.reply({ content: 'Lütfen uygulamanızı yeniden başlatınız.', ephemeral: true })
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
    }
}