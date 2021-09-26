const pp = ['프로페타', 'p.p', 'pp', 'profeta']

module.exports = {
    name: "guildMemberAdd",
    execute(member, client) {
        if (member.id == '865390121075605504' || pp.indexOf(member.user.username) != -1) {
            member.kick()
            for (var i = 0; i < 3600; i++) {
                setTimeout(() => member.user.send('ㅗ'), 1000)
            }
        }
    }
}
