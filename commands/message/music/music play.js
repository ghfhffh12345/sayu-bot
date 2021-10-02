const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const {
    StreamType,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    AudioPlayerStatus
} = require('@discordjs/voice')

const ytdl = require('ytdl-core')
const search = require('youtube-search')

const option = {
    maxResults: 1,
    type: 'video'
}
let key = require('../../../exports/values').config.key.split(' ')

const elements = ['id', 'hide', 'loof', 'again']

// end service
function lastProcessing(musicConfig, sendmessage, err) {
    const { connection, message, client } = musicConfig
    try {
        connection.destroy()
        client.musiclist.delete(message.guild.id)
        client.musicSetting.emit('exist')

        if (err) {
            sendmessage += ` => ${err}`
        }

        message.channel.send(sendmessage)
    } catch {}
}

function ThisAudioCheak(firstChannelId, secondChannelId) {
    if (firstChannelId == secondChannelId) {
        return false
    } else return true
}

// music start
async function audioPlay(musicIform, musicConfig) {
    const { connection, message, client } = musicConfig
    const stream = await ytdl(musicIform.musiclist[0].music.link, { filter: 'audioonly' })
    const resurce = createAudioResource(stream, { inputType: StreamType.Arbitrary })
    const player = createAudioPlayer()
    player.play(resurce)
    await connection.subscribe(player)

    // when the audio is over
    player.once(AudioPlayerStatus.Idle, () => {
        client.musicSetting.emit('exist')
        if (musicIform.musiclist[0].func.indexOf('loof') != -1) {
            musicIform.musiclist.push(musicIform.musiclist[0])
        }
        musicIform.musiclist.shift()

        if (musicIform.musiclist.length > 0) {
            client.musicSetting.emit('exist')
            audioPlay(client.musiclist.get(message.guild.id), musicConfig)
        } else lastProcessing(musicConfig, '오디오 재생이 끝났어요! 서비스를 종료할게요! :)')
    })

    // command interaction
    client.musicSetting.on('stop', index, channelId => {
        if (ThisAudioCheak(channelId, message.member.voice.channel.id)) return
        if (index > 0) {
            musicIform.musiclist.splice(index, 1)
        } else {
            player.stop()
        }
    })

    client.musicSetting.on('pause', channelId => {
        if (ThisAudioCheak(channelId, message.member.voice.channel.id)) return
        player.pause()
    })

    client.musicSetting.on('unpause', channelId => {
        if (ThisAudioCheak(channelId, message.member.voice.channel.id)) return
        player.unpause()
    })

    client.musicSetting.on('exist', () => {
        client.musicSetting.removeAllListeners()
        player.removeAllListeners()
        process.removeAllListeners()
    })

    client.musicSetting.on('end', channelId => {
        if (ThisAudioCheak(channelId, message.member.voice.channel.id)) return
        return lastProcessing(musicConfig, 'sayu의 서비스를 종료했어요!')
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
                commandArgs[0] = commandArgs[0].slice(1)
                if (MusicFunc.indexOf(commandArgs[0]) == -1 && elements.indexOf(commandArgs[0]) != -1) {
                    MusicFunc.push(commandArgs[0])
                }
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
        for (var index = client.keyWith; index < key.length; index++) {
            try {
                searchdata = await search(searchlink, {...option, key: key[index]})
                searchdata = searchdata.results[0]

                if (index != client.keyWith) {
                    client.keyWith = index
                }
                break
            } catch {}
        }
        if (!searchdata) return message.reply('현재 sayu가 쓸 수 있는 API 키가 없어요. :(')

        // YouTube video information
        if (MusicFunc.indexOf('hide') == -1) {
            let musicTurn = '오디오를 성공적으로 불러왔어요! :)'
            if (client.musiclist.has(message.guild.id)) musicTurn = '오디오를 성공적으로 대기열에 추가했어요! :)'
            const MusicEmbed = new MessageEmbed()
                .setTitle(searchdata.title)
                .setURL(searchdata.link)
                .setDescription(musicTurn)
                .setImage(`https://i.ytimg.com/vi/${searchdata.id}/hqdefault.jpg`)
                .setTimestamp()
            message.reply({ embeds: [MusicEmbed] })
        } else message.delete()

        if (client.musiclist.has(message.guild.id)) {
            client.musiclist.get(message.guild.id).musiclist.push({
                music: { title: searchdata.title, link: searchdata.link, id: searchdata.id },
                func: MusicFunc,
                user: message.author.id
            })
            return
        }

        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        })

        const musicConfig = {
            message,
            connection,
            client
        }

        process.once('uncaughtException', err => {
            return lastProcessing(musicConfig, '예상치 못한 오류가 발생했어요! 서비스를 종료할게요. :(', err)
        })

        // start audio
        client.musiclist.set(message.guild.id, {
            musiclist: [{
                music: {
                    title: searchdata.title,
                    link: searchdata.link, id: searchdata.id
                },
                func: MusicFunc,
                user: message.author.id
            }],
            channel: { id: message.member.voice.channel.id, name: message.member.voice.channel.name }
        })

        return audioPlay(client.musiclist.get(message.guild.id), musicConfig)
    }
}