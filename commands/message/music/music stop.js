const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mstop')
        .setDescription('[Command] [Music Number(선택사항)] => music을 건너뜁니다.'),
    aliases: ['ms', 'mskip'],
    voice_permission_check: true,
    user_privileges: true,
    execute(message, client, commandArgs) {
        let sendMessage = '현재 재생되고 있는'
        if (commandArgs.length > 1) {
            client.musicSetting.emit('stop', parseInt(commandArgs[1], 10) - 1)
            sendMessage = `${commandArgs[1]}번째`
        } else {
            client.musicSetting.emit('stop', 0)
        }
        message.reply(`${sendMessage} 오디오를 건너뛰었습니다. :)`)
    }
}