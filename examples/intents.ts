import { Client, Intents } from "https://deno.land/x/coward@dev/mod.ts";

let client = new Client(
    "TOKEN",
    {
        intents: [
            Intents.GUILDS,
            Intents.GUILD_MESSAGES,
        ]
    }
);

const evt = client.evt;

evt.ready.attach(() => console.log("READY") )

evt.messageCreate.attach(async ({ message }) => {
	if(message.content == "!ping") {
        await client.createMessage(message.channel.id, "彡ﾟ◉ω◉ )つー☆* pong!")
    }
})

client.connect();