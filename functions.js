function element(message, client, commandArgs, callback, content) {
    const musicIform = client.musiclist.get(message.guild.id)
    const index = parseInt(commandArgs[1], 10) - 1
    if (index < musicIform.musiclist.length && index > -1) {
        if (user_permission_check(message, musicIform, index)) return

        commandArgs.splice(0, 2)
        while (0 < commandArgs.length) {
            if (commandArgs[0].indexOf('-') == 0) {
                commandArgs[0] = commandArgs[0].slice(1)
                const temp = musicIform.musiclist[index].func.indexOf(commandArgs[0])
                callback(musicIform.musiclist[index].func, temp)
            }
            commandArgs.shift()
        }

        message.reply(`성공적으로 요소를 ${content}했어요. :)`)
    } else message.channel.send('test')
}

function user_permission_check(message, musicIform, index) {
    if (musicIform.musiclist[index].user != message.author.id) {
        message.reply(`${message.author.username}님은 이 오디오를 시작하지 않았기 때문에 권한이 없습니다... :(`)
        return true
    }
}

exports.element = element
exports.user_permission_check = user_permission_check