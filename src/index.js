const axios = require("axios");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { config } = require("dotenv");

config();

const TOKEN = process.env.BOT_TOKEN;
const channel_id = "1255263173968265237";
const message_id = "1277530682897334364";
const YOUTUBE_CHANNEL_ID = "UCXk_odsdlVmnjtGIqjGCvDA";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
    ],
});

async function updateSubscriberCount() {
    try {
        const channel = await client.channels.fetch(channel_id);
        
        const response = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
            params: {
                part: "statistics",
                id: YOUTUBE_CHANNEL_ID,
                key: YOUTUBE_API_KEY,
            }
        });

        const subscriberCount = response.data.items[0].statistics.subscriberCount;
        const messageContent = `Prediqtt subscriber count is currently at **${subscriberCount}** subscribers on YouTube!`;

        const message = await channel.messages.fetch(message_id);
        await message.edit(messageContent);

        console.log("Message edited successfully");
    } catch (error) {
        console.error("Failure in either editing the message or in fetching sub count:", error);
    }
}

client.on("ready", () => {
    console.log("Bot is ready");

    updateSubscriberCount();

    setInterval(updateSubscriberCount, 1800000);
});

(async () => {
    try {
        await client.login(TOKEN);
    } catch (error) {
        console.error("Failed to login:", error);
    }
})();
