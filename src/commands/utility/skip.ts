import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Reproduce música en tu canal de voz')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Nombre o URL de la canción')
				.setRequired(true)),

	async execute(interaction: ChatInputCommandInteraction) {
		
	}
};
