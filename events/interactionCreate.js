module.exports = {
    name: "interactionCreate",
    execute(interaction, client) {
        if (!interaction.isCommand()) return
        const { commandName } = interaction

        const command = client.commands.get(commandName)
        if (!command) return
        try {
            command.execute(interaction, client)
        } catch (error) {
            message.reply("Ohh No! It's Error!")
        }
    }
}
