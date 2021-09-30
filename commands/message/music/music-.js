const { SlashCommandBuilder } = require('@discordjs/builders')
const { element } = require('../../../exports/functions')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mminus')
        .setDescription('[Command] [Music Number] [Element]... => 해당 music의 지정한 Element들을 삭제합니다.'),
    aliases: ['m-'],
    number_of_elements: 3,
    voice_permission_check: true,
    execute(message, client, commandArgs) {
        element(message, client, commandArgs, (FuncIform, temp) => {
            if (temp != -1) {
                FuncIform.splice(temp, 1)
            }
        }, '삭제')
    }
}