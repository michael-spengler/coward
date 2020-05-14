import { Coward} from "https://deno.land/x/coward/mod.ts";

let client = new Coward("TOKEN!");

client.on("ready", () => {
	console.log("Ready!");
})

client.on("messageCreate", async (message: any) => {
	if(message.content == "!ping") {
		client.postMessage(message.channel.id, "Pong!");
	}
})

client.connect();
