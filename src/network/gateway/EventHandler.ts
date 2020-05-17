import { Client } from "../../Client.ts"

export function handleEvent(client: Client, message: any) {
	switch(message.t) {
		case "READY":
			client.onReady.post(undefined)
			break
	}
}
