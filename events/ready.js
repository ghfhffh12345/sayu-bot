const { prefix } = require('../exports/values').config

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log('Ready!')
        client.user.setActivity(`${prefix}help | ${client.guilds.cache.size}개의 서버에서 활동 중! | '너의 이름은' 보는 중...`)
    }
}