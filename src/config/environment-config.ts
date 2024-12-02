import dotenv from 'dotenv';

dotenv.config({ path: '.env.dev' });

export const config = {
	BOT_TOKEN: process.env.BOT_TOKEN
};
