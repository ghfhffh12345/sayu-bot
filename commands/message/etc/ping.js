const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    aliases: ['piong', 'poing'],
    execute(message, client) {
         message.reply(`Pong! | ${client.ws.ping} ms`)
    }
}