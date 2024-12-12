import { ChatInputCommandInteraction, SlashCommandBuilder, VoiceChannel } from "discord.js";
import { joinVoiceChannel, VoiceConnectionStatus, entersState, DiscordGatewayAdapterImplementerMethods, DiscordGatewayAdapterLibraryMethods } from "@discordjs/voice";
import { config } from "src/config/environment-config";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Reproduce la canción que desees en un canal de voz')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Nombre de la canción')
				.setRequired(true))
		.addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('El canal de voz donde deseas reproducir')
				.addChannelTypes(2)
				.setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
		const channel = interaction.options.getChannel('channel') as VoiceChannel;
		
		try {
			const songName = interaction.options.getString('name') ?? ''
			await interaction.reply('Reproduciendo: ' + songName)
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "No se pudo conectar al canal de voz. Verifica los permisos del bot.",
				ephemeral: true,
			});
		}
	}
};
