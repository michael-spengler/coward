import { Client } from "../../Client.ts"
import { Guild, GuildMember, Message, User, Role, Channel } from "../../Classes.ts";

export function handleEvent(client: Client, message: any) {
	switch(message.t) {
		case "READY": {
			client.evtReady.post(undefined)
			break
		}
		case "CHANNEL_CREATE": {
			client.evtChannelCreate.post(Channel.from(message.d, client))
			break
		}
		case "CHANNEL_UPDATE": {
			client.evtChannelUpdate.post(Channel.from(message.d, client))
			break
		}
		case "CHANNEL_DELETE": {
			client.evtChannelDelete.post(Channel.from(message.d, client))
			break
		}
		case "CHANNEL_PINS_UPDATE": {
			client.evtChannelPinsUpdate.post(Channel.from(message.d, client))
			break
		}
	}
}
