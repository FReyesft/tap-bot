import chalk from "chalk";
import { Client } from "discord.js";

export default (client: Client): void => {
    client.on("ready", async () => {
			if (!client.user || !client.application) {
						console.log(chalk.bgRed.bold(`The client cant be online`));
            return;
        }

				console.log(chalk.bgGreen.bold(`${client.user.username} is online and running`));
			});
};