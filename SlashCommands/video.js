const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const xvideos = require('@amedellin85/xvideos-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('video')
        .setDescription('En son eklenen videoları gösterir.'),
    async execute(interaction) {
        if (!interaction.channel.nsfw) {
            return interaction.reply({ content: 'Bu komutu sadece NSFW olarak işaretlenmiş kanallarda kullanabilirsiniz.', ephemeral: true });
        }

        try {
            let fresh = await xvideos.videos.fresh({ page: 1 });
            let page = 1;
            const maxPage = fresh.pagination.pages.length;

            const generateEmbed = (page, videos) => {
                const video = videos[0];
                console.log(video)
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(video.title)
                    .setURL(video.url)
                    .setImage(video.thumbnail)
                    .setDescription(`
**Süre:** ${video.duration}
**İzlenme:** ${video.views}
`)
                return embed;
            };

            const generateButtons = (page, hasNext, hasPrevious) => {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev')
                            .setEmoji('1251247358776315976')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(!hasPrevious),
                        new ButtonBuilder()
                            .setCustomId('page')
                            .setLabel(`${page} / ${maxPage}`)
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setEmoji('1260179083090858117')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(!hasNext)
                    );
                return row;
            };

            const message = await interaction.reply({
                embeds: [generateEmbed(page, fresh.videos)],
                components: [generateButtons(page, fresh.hasNext(), fresh.hasPrevious())],
                ephemeral: false
            });

            const collector = message.createMessageComponentCollector({ time: 60000 });

            collector.on('collect', async i => {
                if (i.user.id === interaction.user.id) {
                    if (i.customId === 'prev' && fresh.hasPrevious()) {
                        page = page - 1;
                        page = fresh.pagination.current;
                    } else if (i.customId === 'next' && fresh.hasNext()) {
                        fresh = await fresh.next();
                        page = page + 1;
                    }

                    await i.update({
                        embeds: [generateEmbed(page, fresh.videos)],
                        components: [generateButtons(page, fresh.hasNext(), fresh.hasPrevious())]
                    });
                }
            });

            collector.on('end', collected => {
                message.edit({ components: [] });
            });
        } catch (error) {
            console.error(error);
        }
    },
};
