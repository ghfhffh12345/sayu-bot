const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('munpause')
        .setDescription('[Command] => 현재 재생 중인 music을 일시중지 해제합니다.'),
    aliases: ['mup'],
    voice_permission_check: true,
    user_privileges: true,
    execute(message, client) {
        client.musicSetting.emit('unpause', message.member.voice.channel.id)
        message.reply('현재 재생되고 있는 오디오를 일시중지 해제하였습니다. :)')
    }
}