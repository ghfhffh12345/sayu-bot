const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mplus')
        .setDescription('[Command] [Music Number] [Element]... => 해당 music의 지정한 Element들을 추가합니다.'),
    aliases: ['m+'],
    number_of_elements: 3,
    voice_permission_check: true,
    execute(message, client, commandArgs) {
        const musicIform = client.musiclist.get(message.guild.id)
        const index = parseInt(commandArgs[1], 10) - 1
        if (client.user_permission_check(message, musicIform, index)) return

        commandArgs.splice(0, 2)
        while (0 < commandArgs.length) {
            if (commandArgs[0].indexOf('-') == 0) {
                commandArgs[0] = commandArgs[0].slice(1)
                if (musicIform.musiclist[index].func.indexOf(commandArgs[0]) == -1) {
                    musicIform.musiclist[index].func.push(commandArgs[0])
                }
            }
            commandArgs.shift()
        }

        message.reply('성공적으로 요소를 추가했어요. :)')
    }
}