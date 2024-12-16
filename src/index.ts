import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import figlet from 'figlet';
import { Client, Collection, GatewayIntentBits, Interaction, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import { config } from './config/environment-config';
import { Player } from 'discord-player';

interface Command {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    execute: (interaction: Interaction) => Promise<void>;
}

interface ExtendedClient extends Client {
    commands: Collection<string, Command>;
    player: Player,
}

const client: ExtendedClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
}) as ExtendedClient;

client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    },
    blockExtractors: []
});

client.commands = new Collection();

const deleteCommands = async () => {
    const rest = new REST().setToken(config.BOT_TOKEN!);

    try {
        await rest.put(Routes.applicationGuildCommands(config.APPLICATION_ID!, config.GUILD_ID!), { body: [] });
        console.log(chalk.bgRed.bold.white('🚯 Successfully deleted all guild commands.'));
    } catch (error) {
        console.error(chalk.bgRed.bold.white('❌ Error deleting guild commands:'), error);
    }

    try {
        await rest.put(Routes.applicationCommands(config.APPLICATION_ID!), { body: [] });
        console.log(chalk.bgRed.bold.white('🚯 Successfully deleted all application commands.'));
    } catch (error) {
        console.error(chalk.bgRed.bold.white('❌ Error deleting application commands:'), error);
    }
};

const registerCommands = async () => {
    const rest = new REST().setToken(config.BOT_TOKEN!);
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    console.log(chalk.cyan.bold('\n📂 Loading commands...'));
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command: Command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data);
                console.log(chalk.greenBright(`✅ Loaded command: ${chalk.bold(command.data.name)}`));
            } else {
                console.warn(chalk.yellowBright(`[⚠️ Warning] Missing "data" or "execute" in command: ${chalk.italic(filePath)}`));
            }
        }
    }

    try {
        await rest.put(Routes.applicationGuildCommands(config.APPLICATION_ID!, config.GUILD_ID!), { body: commands });
        console.log(chalk.bgGreen.black('✅ Successfully registered all guild commands.'));
    } catch (error) {
        console.error(chalk.bgRed.bold.white('❌ Error registering guild commands:'), error);
    }
};

const registerEvents = () => {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

    console.log(chalk.cyan.bold('\n🎉 Loading events...'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(chalk.greenBright(`✅ Loaded event: ${chalk.bold(event.name)}`));
    }
};

const displayBanner = () => {
    console.log(chalk.blueBright.bold(figlet.textSync('TAP BOT', { horizontalLayout: 'default' })));
    console.log(chalk.whiteBright('🚀 Starting initialization process...\n'));
};

const createCommandsAndEvents = async () => {
    displayBanner();
    console.log(chalk.yellowBright('🔄 Initializing commands and events...\n'));
    await deleteCommands();
    await registerCommands();
    registerEvents();
    client.login(config.BOT_TOKEN).then(() => {
        console.log(chalk.bgGreen.bold.white('\n🤖 Bot is now online! Ready to serve!'));
        console.log(chalk.greenBright(`📅 Date: ${new Date().toLocaleString()}`));
        console.log(chalk.blueBright(`📡 Connected to: ${client.guilds.cache.size} servers\n`));
    }).catch(error => {
        console.error(chalk.bgRed.bold.white('❌ Error starting bot:'), error);
    });
};

createCommandsAndEvents();