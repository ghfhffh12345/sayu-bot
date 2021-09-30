const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { prefix } = require('../../../exports/values').config
const fs = require('fs')
const commandFolders = fs.readdirSync('./commands/message')

const description = 'sayu의 명령어를 쓸 수 있는 도움말을 알려줍니다.'
const helpEmbed = new MessageEmbed()
    .setTitle('sayu 도움말')
    .setDescription(description)
    .setColor('#ffcd78')
    .setTimestamp()
let String = ''
for (folder of commandFolders) {
    String += `\n${folder}`
}
helpEmbed.addField(`밑의 폴더들 안에 명령어 사용법을 보시려면 '${prefix}help -[폴더명]'으로 해주세요. :)`, String, false)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('[Command] => 도움말을 임베드 형식으로 답장합니다.'),
    aliases: ['h', 'hlep'],
    execute(message, client, commandArgs) {
        if (commandArgs.length < 2) {
            message.reply({ embeds: [helpEmbed] })
        } else {
            if (commandArgs[1].indexOf('-') == 0) {
                const folderName = commandArgs[1].slice(1)
                const folderNameIform = fs.readdirSync(`./commands/message/${folderName}`)
                const Embed = new MessageEmbed()
                    .setTitle(`sayu ${folderName} 도움말`)
                    .setColor('#ffcd78')
                    .setTimestamp()
                
                let README = false
                for (file of folderNameIform) {
                    if (file != 'README.txt') {
                        const fileIform = require(`../${folderName}/${file}`)
                        Embed.addField(`${fileIform.data.name} or ${fileIform.aliases.join(' or ')}`, fileIform.data.description, false)
                    } else README = true
                }

                let txt = ''
                if (README) {
                    txt = fs.readFileSync(`./commands/message/${folderName}/README.txt`).toString()
                }
                Embed.setDescription(`모든 명령어 앞에는 ${prefix}가 들어가야 합니다.\n모든 Element은 -[Element]로 표기됩니다.\nElement은 다수 선택 가능합니다.\n` + txt)
                message.reply({ embeds: [Embed] })
            }
        }
    }
}