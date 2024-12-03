import chalk from "chalk";
import { Client } from "discord.js";

const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {
    console.log(chalk.bgGreen.white.bold(`✅ Ready! Logged in as ${client?.user?.tag}`));
	},
};