const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('merror')
        .setDescription('먼지 안 알랴줌'),
    aliases: ['mer'],
    voice_permission_check: true,
    execute(message, client, commandArgs) {
        client.musicSetting.emit('test')
    }
}