import { SlashCommandBuilder, ChannelType, ChatInputCommandInteraction, TextChannel, EmbedBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Replies with your input!')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The input to echo back')
				.setMaxLength(2000))
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to echo into')
				.addChannelTypes(ChannelType.GuildText))
		.addBooleanOption(option =>
			option.setName('embed')
				.setDescription('Whether or not the echo should be embedded')),
	async execute(interaction: ChatInputCommandInteraction) {
		const input = interaction.options.getString('input');
		const channel = interaction.options.getChannel('channel');
		const embed = interaction.options.getBoolean('embed');

		const textChannel = channel as TextChannel;
		if (!textChannel || !textChannel.isTextBased()) {
			await interaction.reply({ content: 'Unable to send messages to the specified channel!', ephemeral: true });
			return;
		}

		if (embed) {
			const embedBuilded = new EmbedBuilder()
				.setColor('#0099ff')
				.setDescription(input)
			await textChannel.send({ embeds: [embedBuilded] });
		} else {
			await textChannel.send(input!);
		}
	},
};
