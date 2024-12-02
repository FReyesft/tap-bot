import { Client, Events, GatewayIntentBits, CommandInteraction, Interaction } from 'discord.js';
import { config } from './config/environment-config';
import { getCommands } from './commands/commands';
import chalk from 'chalk';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const registerCommands = async (client: Client) => {
    try {
        const commands = getCommands();
        for (const cmd of commands) {
            await client.application?.commands.create(cmd.data.toJSON());
            console.log(chalk.bgBlue(`Comando registrado: ${cmd.data.name}`));
        }
    } catch (error) {
        console.error(chalk.bgRed("Error al registrar los comandos: "), error);
    }
};

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isCommand()) {
        const { commandName } = interaction as CommandInteraction;

        const commands = getCommands();
        const command = commands.find(cmd => cmd.data.name === commandName);
        if (command) {
            await command.execute(interaction);
        }
    }
});

client.once(Events.ClientReady, async () => {
    console.log(chalk.bgGreen.bold(`Ready! Logged in as ${client.user?.tag}`));
    
    await registerCommands(client);
});

client.login(config.BOT_TOKEN);
