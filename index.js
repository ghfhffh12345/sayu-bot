// Discord.js module
const { Client, Intents, Collection} = require('discord.js')
const { clientId, guildId, token } = require('./config.json')
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_INTEGRATIONS", "GUILD_VOICE_STATES"]})
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

// Variables needed for handling
const fs = require('fs')
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
const commandFolders = fs.readdirSync('./commands')
client.commands = new Collection()
client.musiclist = new Collection()
client.keyWith = 0

// Command Handling
const commands =[]
for (const folder of commandFolders) {
    const commandFolders2 = fs.readdirSync(`./commands/${folder}`)
    for (const folder2 of commandFolders2) {
        const commandFiles = fs.readdirSync(`./commands/${folder}/${folder2}`).filter(file => file.endsWith('.js'))
        for (const file of commandFiles) {
            if (file != 'README.txt') {
                const command = require(`./commands/${folder}/${folder2}/${file}`)
                client.commands.set(command.data.name, { command, folder: folder2 })
                if (folder == 'interaction') { commands.push(command.data.toJSON()) }
            }
        }
    }
}

// Event Handling
for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if ( event.once ) {
        client.once(event.name, (...args) => event.execute(...args, client))
    } else {
        client.on(event.name, (...args) => event.execute(...args, client))
    }
}

// Register the hatch command
const rest = new REST({ version: '9' }).setToken(token)
try {
    console.log('Started refreshing application (/) commands.')

    rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
    )

    console.log('Successfully reloaded application (/) commands.')
} catch (error) {
    console.error(error)
}

// events create
function MusicListener() { this.events = {} }

MusicListener.prototype.on = function (type, listener) {
    this.events[type] = this.events[type] || []
    this.events[type].push(listener)
}

MusicListener.prototype.emit = function (type, ...interaction) {
    if (this.events[type]) {
        this.events[type].forEach(function (listener) { listener(interaction) })
    }
}

client.musicSetting = new MusicListener()

// bot login
client.login(token)