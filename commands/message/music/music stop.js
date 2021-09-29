const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mstop')
        .setDescription('[Command] [Music Number(선택사항)] => music을 건너뜁니다.'),
    aliases: ['ms', 'mskip'],
    voice_permission_check: true,
    user_privileges: true,
    execute(message, client, commandArgs) {
        let skipNumber = parseInt(commandArgs[1], 10) || 1
        client.musicSetting.emit('stop', skipNumber - 1)
        message.reply(`해당 오디오를 건너뛰었습니다. :)`)
    }
}