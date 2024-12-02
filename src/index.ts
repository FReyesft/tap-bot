import { Client } from "discord.js";
import ready from "./listerners/ready";
import { config } from "./config/environment-config";

const token = config.BOT_TOKEN;

const client = new Client({
    intents: []
});

ready(client);

client.login(token);