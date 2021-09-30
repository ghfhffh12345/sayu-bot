const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { StreamType, createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice')
const ytdl = require('ytdl-core')
const search = require('youtube-search')

const option = {
    maxResults: 1,
    type: 'video'
}
let key = require('../../../exports/values').config.key.split(' ')

// end service
function lastProcessing(message, connection, client, sendmessage, err) {
    try {connection.destroy()} catch {}
    client.musiclist.delete(message.guild.id)
    client.musicSetting.emit('exist')

    if (sendmessage) {
        let Sendmessage = sendmessage
        if (err) Sendmessage += ` => ${err}`
        message.channel.send(Sendmessage)
    }
}

// music start
async function audioPlay(musicIform, connection, message, client) {
    const stream = await ytdl(musicIform.musiclist[0].music.link, { filter: 'audioonly' })
    const resurce = createAudioResource(stream, { inputType: StreamType.Arbitrary })
    const player = createAudioPlayer()
    player.play(resurce)
    await connection.subscribe(player)

    // when the audio is over
    player.once(AudioPlayerStatus.Idle, () => {
        client.musicSetting.emit('exist')
        player.removeAllListeners()
        if (musicIform.musiclist[0].func.indexOf('loof') != -1) musicIform.musiclist.push(musicIform.musiclist[0])
        musicIform.musiclist.shift()
        if (musicIform.musiclist.length > 0) {
            client.musicSetting.emit('exist')
            audioPlay(client.musiclist.get(message.guild.id), connection, message, client)
        } else lastProcessing(message, connection, client, '오디오 재생이 끝났어요! 서비스를 종료할게요! :)')
    })

    // command interaction
    client.musicSetting.on('stop', index => {
        if (index > 0) {
            musicIform.musiclist.splice(index, 1)
        } else {
            player.stop()
        }
    })
    client.musicSetting.on('pause', () => { player.pause() })
    client.musicSetting.on('unpause', () => { player.unpause() })
    client.musicSetting.on('exist', () => { client.musicSetting.removeAllListeners() })
    client.musicSetting.on('end', () => {
        return lastProcessing(message, connection, client, 'sayu의 서비스를 종료했어요!')
    })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('[Command] [Element]... [Music] => music을 재생하거나 리스트에 추가합니다.'),
    aliases: ['m'],
    number_of_elements: 2,
    voice_permission_check: true,
    async execute(message, client, commandArgs) {
        // Save music add-on
        commandArgs.shift()
        const MusicFunc = []
        while (0 < commandArgs.length) {
            if (commandArgs[0].indexOf('-') == 0) {
                if (MusicFunc.indexOf(commandArgs[0].slice(1)) == -1) MusicFunc.push(commandArgs[0].slice(1))
                commandArgs.shift()
            } else break
        }

        // Check if you have a valid api key
        let searchdata
        let searchlink = commandArgs.join(' ')
        if (MusicFunc.indexOf('id') != -1) {
            searchlink = `https://www.youtube.com/watch?v=${commandArgs[0]}`
            MusicFunc.slice(MusicFunc.indexOf('id'), 1)
        }
        for (var i = client.keyWith; i < key.length; i++) {
            try {
                searchdata = await search(searchlink, {...option, key: key[i]})
                if (i != client.keyWith) client.keyWith = i
                break
            } catch {}
        }
        if (!searchdata) return message.reply('현재 sayu가 쓸 수 있는 API 키가 없어요. :(')

        // YouTube video information
        if (MusicFunc.indexOf('hide') == -1) {
            let musicTurn = '오디오를 성공적으로 불러왔어요! :)'
            if (client.musiclist.has(message.guild.id)) musicTurn = '오디오를 성공적으로 대기열에 추가했어요! :)'
            const MusicEmbed = new MessageEmbed()
                .setTitle(searchdata.results[0].title)
                .setURL(searchdata.results[0].link)
                .setDescription(musicTurn)
                .setImage(`https://i.ytimg.com/vi/${searchdata.results[0].id}/hqdefault.jpg`)
                .setTimestamp()
            message.reply({ embeds: [MusicEmbed] })
        } else message.delete()
        if (client.musiclist.has(message.guild.id)) return client.musiclist.get(message.guild.id).musiclist.push({ music: { title: searchdata.results[0].title, link: searchdata.results[0].link, id: searchdata.results[0].id }, func: MusicFunc, user: message.author.id })

        process.once('uncaughtException', err => {
            return lastProcessing(message, connection, client, '예상치 못한 오류가 발생했어요! 서비스를 종료할게요. :(', err)
        })

        // start audio
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        })
        client.musiclist.set(message.guild.id, { musiclist: [{ music: { title: searchdata.results[0].title, link: searchdata.results[0].link, id: searchdata.results[0].id }, func: MusicFunc, user: message.author.id, func: MusicFunc, user: message.author.id }], channel: { id: message.member.voice.channel.id, name: message.member.voice.channel.name }})
        return audioPlay(client.musiclist.get(message.guild.id), connection, message, client)
    }
}