import dotenv from 'dotenv';

dotenv.config({ path: '.env.dev' });

export const config = {
	BOT_TOKEN: process.env.BOT_TOKEN,
	GUILD_ID: process.env.GUILD_ID,
	APPLICATION_ID: process.env.APPLICATION_ID
};
