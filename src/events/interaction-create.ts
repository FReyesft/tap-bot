import chalk from 'chalk';
import { Events, MessageFlags } from 'discord.js';

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction: any) {
		if (!interaction.isChatInputCommand()) return;

		const client = interaction.client;
		const command = client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			console.log(chalk.blue(chalk.bgBlue.white.bold(`✅ ${interaction.commandName} command executed by ${interaction.user.username}`)));

			if (interaction.replied || interaction.deferred) {
				console.log('Interaction has already been acknowledged, skipping reply.');
				return;
			}

			await command.execute(interaction);
		} catch (error) {
			console.error(error);

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			}
		}
	},
};
