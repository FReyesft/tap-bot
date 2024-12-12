import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { Client, Collection, GatewayIntentBits, Interaction, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import { config } from './config/environment-config';

interface Command {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    execute: (interaction: Interaction) => Promise<void>;
}

interface ExtendedClient extends Client {
    commands: Collection<string, Command>;
}

const client: ExtendedClient = new Client({ intents: [GatewayIntentBits.Guilds] }) as ExtendedClient;

client.commands = new Collection();

const deleteCommands = async () => {
    const rest = new REST().setToken(config.BOT_TOKEN!);

    try {
        await rest.put(Routes.applicationGuildCommands(config.APPLICATION_ID!, config.GUILD_ID!), { body: [] });
        console.log(chalk.bgRed('🚯 Successfully deleted all guild commands.'));
    } catch (error) {
        console.error(chalk.red('❌ Error deleting guild commands:'), error);
    }

    try {
        await rest.put(Routes.applicationCommands(config.APPLICATION_ID!), { body: [] });
        console.log(chalk.bgRed('🚯 Successfully deleted all application commands.'));
    } catch (error) {
        console.error(chalk.red('❌ Error deleting application commands:'), error);
    }
};

const registerCommands = async () => {
    const rest = new REST().setToken(config.BOT_TOKEN!);
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command: Command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data); // Preparar comandos para registrar
                console.log(chalk.green(`✅ Loaded command: ${chalk.bold(command.data.name)}`));
            } else {
                console.warn(chalk.yellow(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`));
            }
        }
    }

    try {
        await rest.put(Routes.applicationGuildCommands(config.APPLICATION_ID!, config.GUILD_ID!), { body: commands });
        console.log(chalk.bgGreen('✅ Successfully registered all guild commands.'));
    } catch (error) {
        console.error(chalk.red('❌ Error registering guild commands:'), error);
    }
};

const registerEvents = () => {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(chalk.green(`✅ Loaded event: ${chalk.bold(event.name)}`));
    }
};

const createCommandsAndEvents = async () => {
    console.log(chalk.blue('🔄 Starting command and event initialization...'));
    await deleteCommands();
    await registerCommands();
    registerEvents();
    client.login(config.BOT_TOKEN).then(() => {
        console.log(chalk.bgGreen('🤖 Bot is now online!'));
    }).catch(error => {
        console.error(chalk.bgRed('❌ Error starting bot:'), error);
    });
};

createCommandsAndEvents();
