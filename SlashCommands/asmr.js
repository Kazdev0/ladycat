const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, generateDependencyReport } = require('@discordjs/voice');
const path = require('path');
console.log(generateDependencyReport());
module.exports = {
    data: new SlashCommandBuilder()
        .setName('asmr')
        .setDescription('Sese gelip sana asmr yaparım.'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: 'Bu komutu kullanmak için bir ses kanalında olmalısınız.', ephemeral: true });
        }
        if (!voiceChannel.nsfw) {
            return interaction.reply({ content: 'Bu komutu sadece NSFW kanallarda kullanabilirsiniz.', ephemeral: true });
        }
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(path.join(__dirname, 'voices', 'asmr.mp3'));

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });

        await interaction.reply({ content: 'geldim askim', ephemeral: false });
    },
};
