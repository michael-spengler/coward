import { Client } from "../mod.ts";

let client = new Client("TOKEN");

const evt = client.evt;

evt.messageCreate.attach(async ({ message }) => {
	if (message.author.bot) return;
	client.postMessage(message.channel.id, "received message");
})

client.connect();