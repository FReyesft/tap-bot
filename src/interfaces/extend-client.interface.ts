import { Client, Collection } from 'discord.js';
import { Player } from 'discord-player';

interface Command {
    data: any;
    execute: (interaction: any) => Promise<void>;
}

export interface ExtendedClient extends Client {
    commands: Collection<string, Command>;
    player: Player;
}
