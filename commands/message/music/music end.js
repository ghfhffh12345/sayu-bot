const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mend')
        .setDescription('[Command] => music 서비스를 끝냅니다.'),
    aliases: ['me', 'men'],
    voice_permission_check: true,
    execute(message, client) {
        if (message.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD]) || message.author.id == '751984811622793266') {
            client.musicSetting.emit('end', message.member.voice.channel.id)
        } else message.reply(`${message.author.username}님은 관리자 권한을 가지고 있지 않아요!`)
    }
}