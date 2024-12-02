import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export const getCommands = () => {
    return [
        {
            data: new SlashCommandBuilder()
                .setName('user')
                .setDescription('Información de tu usuario'),
            async execute(interaction: CommandInteraction) {
                await interaction.reply(`Tu nombre de usuario es: ${interaction.user.username}\nTu tag es: ${interaction.user.tag}`);
            }
        }
    ];
};
