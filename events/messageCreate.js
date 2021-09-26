const { prefix } = require('../index').config
const { user_permission_check } = require('../functions')

module.exports = {
    name: "messageCreate",
    execute(message, client) {
        if (message.author.bot) return
        if (message.content.indexOf(prefix) != 0) return

        const commandArgs = message.content.trim().slice(prefix.length).split(' ')
        let command = client.commands.get(commandArgs[0])
            || client.commands.find(cmd => cmd.command.aliases && cmd.command.aliases.includes(commandArgs[0]))

        if (!command) return
        command = command.command

        if (command.number_of_elements) {
            if (commandArgs.length < command.number_of_elements) return message.reply(command.data.description)
        }

        if (command.voice_permission_check) {
            if (client.musiclist.has(message.guild.id)) {
                let musicIform = client.musiclist.get(message.guild.id)
                if (message.member.voice.channel.id != musicIform.channel.id) return message.reply(`<#${musicIform.channel.id}> 음성 채널에 먼저 연결해주세요!`)

                if (client.user_privileges) {
                    if (user_permission_check(message, musicIform, 0)) return
                }
            } else if (!message.member.voice.channel) return message.reply('음성 채널에 먼저 연결해주세요!')
        }

        try {
            command.execute(message, client, commandArgs)
        } catch (error) {
            message.reply(`에러가 발생했어요! :( => ${error}`)
        }
    }
}
