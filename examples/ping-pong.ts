import { Client } from "https://deno.land/x/coward@dev/mod.ts";

const client = new Client("TOKEN");

const evt = client.evt;

evt.ready.attach(() => console.log("READY!"))

evt.messageCreate.attach(async ({ message }) => {
	if(message.content == "!ping") {
		await client.createMessage(message.channel.id, "pong!");
	}
})

client.connect();