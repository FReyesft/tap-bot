import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { format } from '@formkit/tempo';

const getUserResponse = (interaction: CommandInteraction): EmbedBuilder => {
	const user = interaction.user;
	const member = interaction.guild?.members.cache.get(user.id);

	const joinDate = member?.joinedTimestamp
		? format(new Date(member.joinedTimestamp), 'full')
		: 'Fecha no disponible';
	const creationDate = user.createdTimestamp
		? format(new Date(user.createdTimestamp), 'full')
		: 'Fecha no disponible';

	const roles = member?.roles.cache
		.filter(role => role.name !== '@everyone')
		.map(role => role.name)
		.join(', ') || 'Sin roles asignados';

	const embed = new EmbedBuilder()
		.setColor('#0099ff')
		.setTitle(`Información del Usuario: ${user.username}`)
		.setThumbnail(user.displayAvatarURL())
		.addFields(
			{ name: '🆔 ID:', value: user.id, inline: false },
			{ name: '👤 Nombre global:', value: user.globalName || 'No establecido', inline: false },
			{ name: '📅 Creación de cuenta:', value: creationDate, inline: false },
			{ name: '📅 Ingreso al servidor:', value: joinDate, inline: false },
			{ name: '🏷️ Roles:', value: roles, inline: false }
		)
		.setFooter({ text: `Solicitado por @${user.username}`, iconURL: user.displayAvatarURL() })
		.setTimestamp();

	return embed;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Proporciona información detallada del usuario.'),
	async execute(interaction: CommandInteraction) {
		const embed = getUserResponse(interaction);
		await interaction.reply({ embeds: [embed] });
	},
};
