import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { Client, Collection, GatewayIntentBits, Interaction, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
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
            console.log(chalk.green(`✅ Loaded command: ${chalk.bold(command.data.name)}`));
        } else {
            console.warn(chalk.yellow(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`));
        }
    }
}

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
}

client.login(config.BOT_TOKEN);
