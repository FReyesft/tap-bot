import { SlashCommandBuilder, ChannelType, CommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Replies with your input!')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The input to echo back')
				.setMaxLength(2_000))
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to echo into')
				.addChannelTypes(ChannelType.GuildText))
		.addBooleanOption(option =>
			option.setName('embed')
				.setDescription('Whether or not the echo should be embedded')),
	async execute(interaction: CommandInteraction) {
		console.log(interaction)
	}
}
