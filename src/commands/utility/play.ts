import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import { ChatInputCommandInteraction, SlashCommandBuilder, GuildMember } from 'discord.js';
import play from 'play-dl';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Reproduce música en tu canal de voz')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Nombre o URL de la canción')
				.setRequired(true)),

	async execute(interaction: ChatInputCommandInteraction) {
		const member = interaction.member as GuildMember;
		const songName = interaction.options.getString('name') ?? 'No se proporcionó un valor';

		if (!member.voice.channel) {
			return interaction.reply('¡Debes estar en un canal de voz para que el bot se una!');
		}

		const connection = joinVoiceChannel({
			channelId: member.voice.channel.id,
			guildId: interaction.guildId!,
			adapterCreator: interaction.guild!.voiceAdapterCreator,
		});

		await interaction.reply(`Buscando la canción: ${songName}`);

		try {
			let videoUrl = '';
			if (play.yt_validate(songName) === 'video') {
				videoUrl = songName;
			} else {
				const searchResult = await play.search(songName, { limit: 1 });
				if (searchResult.length > 0) {
					videoUrl = searchResult[0].url;
				} else {
					return interaction.editReply('No se encontraron resultados para tu búsqueda.');
				}
			}

			const stream = await play.stream(videoUrl, { quality: 2 });
			const resource = createAudioResource(stream.stream, {
				inputType: stream.type,
			});
			const player = createAudioPlayer();

			player.play(resource);
			connection.subscribe(player);

			player.on(AudioPlayerStatus.Idle, () => {
				connection.destroy();
				console.log('Reproducción terminada, conexión cerrada.');
			});

			player.on('error', (error) => {
				console.error(`Error en el reproductor de audio: ${error.message}`);
				connection.destroy();
			});

			interaction.editReply(`Reproduciendo: ${videoUrl}`);
		} catch (error) {
			console.error('Error al reproducir la canción:', error);
			interaction.editReply('Ocurrió un error al intentar reproducir la canción.');
		}
	}
};
