import { entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import { ChatInputCommandInteraction, SlashCommandBuilder, GuildMember } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Hace que el bot se una a tu canal de voz y reproduzca música')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Nombre o url de la canción')
				.setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
		const member = interaction.member as GuildMember;
		const songName = interaction.options.getString('name') ?? 'No se proporciono un valor'
		if (!member.voice.channel) {
			return interaction.reply('¡Debes estar en un canal de voz para que el bot se una!');
		}

		joinVoiceChannel({
			channelId: member.voice.channel.id,
			guildId: interaction.guildId!,
			adapterCreator: interaction.guild!.voiceAdapterCreator,
		});

		try {
			interaction.reply(`Reproduciendo: ${songName}`);
		} catch (error) {
			console.error('Error al unirse al canal de voz:', error);
			interaction.reply('Hubo un error al intentar unirme al canal de voz.');
		}
	},
};
