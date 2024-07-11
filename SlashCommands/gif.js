require('fix-esm').register();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Client } = require('porn-x');
const apiClient = new Client();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Belirtilen bir isim için +18 gif araması yapar.')
        .addStringOption(option =>
            option.setName('isim')
                .setDescription('GIF araması yapılacak isim')
                .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('isim');
        if (!interaction.channel.nsfw) {
            return interaction.reply({ content: 'Bu komutu sadece NSFW kanallarda kullanabilirsiniz.', ephemeral: true });
        }
        try {
            const result = await apiClient.getGif(name);

            if (result && result.gifs.length > 0) {
                let page = 0;
                const maxPage = Math.ceil(result.gifs.length / 1) - 1;

                const generateEmbed = (page) => {
                    const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setTitle(`${name} için bulunan GIF`)
                        .setImage(result.gifs[page])
                    return embed;
                };

                const generateButtons = (page) => {
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('prev')
                                .setEmoji('1251247358776315976')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(page === 0),
                            new ButtonBuilder()
                                .setCustomId('page')
                                .setLabel(`${page + 1} / ${maxPage + 1}`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setEmoji('1260179083090858117')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(page === maxPage),
                            new ButtonBuilder()
                                .setURL(result.gifs[page])
                                .setEmoji('1219233058012528701')
                                .setLabel('İndir')
                                .setStyle(ButtonStyle.Link)
                                .setDisabled(false)
                        );
                    return row;
                };

                const message = await interaction.reply({ embeds: [generateEmbed(page)], components: [generateButtons(page)], ephemeral: false });

                const collector = message.createMessageComponentCollector({ time: 60000 });

                collector.on('collect', async i => {
                    if (i.user.id === interaction.user.id) {
                        if (i.customId === 'prev' && page > 0) {
                            page--;
                        } else if (i.customId === 'next' && page < maxPage) {
                            page++;
                        }

                        await i.update({ embeds: [generateEmbed(page)], components: [generateButtons(page)] });
                    }
                });

                collector.on('end', collected => {
                    message.edit({ components: [] });
                });
            } else {
                await interaction.reply({ content: `\`${name}\` için gif bulunamadı.`, ephemeral: true });
            }
        } catch (error) {
            console.error(error);
        }
    },
};
