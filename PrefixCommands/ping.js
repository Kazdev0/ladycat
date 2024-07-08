module.exports = {
    name: 'ping',
    description: 'Ping! Pong!',
    async execute(message, args) {
        const sent = await message.channel.send('Pinging...');
        sent.edit(`Pong! Gecikme: ${sent.createdTimestamp - message.createdTimestamp}ms. API gecikmesi: ${Math.round(message.client.ws.ping)}ms.`);
    },
};
