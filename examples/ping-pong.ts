import { Client } from "https://deno.land/x/coward@dev/mod.ts";

let client = new Client("TOKEN");

const evt = client.evt;

evt.ready.attach(() => console.log("READY!"))

evt.messageCreate.attach(async ({ message }) => {
	if(message.content == "!ping") {
		client.postMessage(message.channel.id, "pong!");
	}
})

client.connect();