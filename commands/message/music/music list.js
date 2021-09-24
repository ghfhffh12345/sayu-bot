const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mlist')
        .setDescription('[Command] => 서비스 중인 music들을 임베드로 답장합니다.'),
    aliases: ['ml'],
    execute(message, client) {
        if (client.musiclist.has(message.guild.id)) {
            const musicIform = client.musiclist.get(message.guild.id)

            let queue = ''
            let secret, func
            musicIform.musiclist.forEach((value, index, array) => {
                secret = value.music.title
                if (value.func.indexOf('hide') != -1) secret = 'secret'
                func = value.func.join(' ')
                if (value.func.length < 1) func = 'null'
                queue += `\n\`${secret}\`\ntypes:　　\`${func}\``
            })

            const embed = new MessageEmbed()
                .setTitle(`${message.guild.name}`)
                .setDescription(`<#${musicIform.channel.id}> 채널의 정보`)
                .setColor('#ffcd78')
                .addField(queue, 'sayu가 서비스할 오디오 목록이에요! :)')
                .setTimestamp()
            message.reply({ embeds: [embed] })
        } else message.reply('지금 이 서버에서 sayu가 서비스하고 있지 않아요!')
    }
}