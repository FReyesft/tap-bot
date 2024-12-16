import { Player, QueryType } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from 'src/interfaces/extend-client.interface';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song, playlist, or search from YouTube.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('song')
				.setDescription('Plays a single song from YouTube.')
				.addStringOption((option) =>
					option.setName('url').setDescription('The URL of the song.').setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('playlist')
				.setDescription('Plays a playlist from YouTube.')
				.addStringOption((option) =>
					option.setName('url').setDescription('The URL of the playlist.').setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('search')
				.setDescription('Searches for a song and plays it.')
				.addStringOption((option) =>
					option.setName('searchterms').setDescription('Search keywords.').setRequired(true)
				)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const client = interaction.client as ExtendedClient;
		const member = interaction.member as GuildMember;

		if (!member.voice.channel) {
			return interaction.reply({
				content: 'You need to be in a Voice Channel to play a song.',
				ephemeral: true,
			});
		}

		if (!client.player) {
			client.player = new Player(client, {
				ytdlOptions: {
					quality: 'highestaudio',
					highWaterMark: 1 << 25,
				},
			});
		}

		const queue = client.player.queues.create(interaction.guild!, {
			metadata: {
				channel: interaction.channel,
			},
		});

		if (!queue.connection) await queue.connect(member.voice.channel);

		const embed = new EmbedBuilder();
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'song') {
			const url = interaction.options.getString('url', true);
			const result = await client.player.search(url, {
				requestedBy: interaction.user,
				searchEngine: QueryType.YOUTUBE_VIDEO,
			});

			if (!result.tracks.length) {
				return interaction.reply({ content: 'No results found.', ephemeral: true });
			}

			const song = result.tracks[0];
			queue.addTrack(song);

			embed
				.setDescription(`**[${song.title}](${song.url})** has been added to the queue.`)
				.setThumbnail(song.thumbnail)
				.setFooter({ text: `Duration: ${song.duration}` });
		} else if (subcommand === 'playlist') {
			const url = interaction.options.getString('url', true);
			const result = await client.player.search(url, {
				requestedBy: interaction.user,
				searchEngine: QueryType.YOUTUBE_PLAYLIST,
			});

			if (!result.tracks.length) {
				return interaction.reply({ content: 'No playlists found.', ephemeral: true });
			}

			const playlist = result.playlist!;
			for (const track of result.tracks) {
				queue.addTrack(track);
			}

			embed
				.setDescription(
					`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the queue.`
				)
				.setThumbnail(playlist.thumbnail);
		} else if (subcommand === 'search') {
			const searchTerms = interaction.options.getString('searchterms', true);
			const result = await client.player.search(searchTerms, {
				requestedBy: interaction.user,
				searchEngine: QueryType.AUTO,
			});

			if (!result.tracks.length) {
				return interaction.reply({ content: 'No results found.', ephemeral: true });
			}

			const song = result.tracks[0];
			queue.addTrack(song);

			embed
				.setDescription(`**[${song.title}](${song.url})** has been added to the queue.`)
				.setThumbnail(song.thumbnail)
				.setFooter({ text: `Duration: ${song.duration}` });
		}

		if (!queue.isPlaying) await queue.play(queue.currentTrack!);

		await interaction.reply({ embeds: [embed] });
	},
};
