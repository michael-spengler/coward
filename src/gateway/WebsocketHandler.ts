import { connectWebSocket, isWebSocketCloseEvent, WebSocket } from "https://deno.land/std/ws/mod.ts";
import { blue, green, red, bold, reset} from "https://deno.land/std/fmt/colors.ts";
import { Versions, Discord, Endpoints } from '../util/Constants.ts';

import { Client } from "../Client.ts";
import { Message } from "../classes/Message.ts";

export default class Gateway {
	public sock!: WebSocket;
	private sequence: any = null;

	constructor(private token: string, private client: Client) {}

	public async connect(): Promise<void> {
		try {
			this.sock = await connectWebSocket(`${Discord.GATEWAY}/v=${Versions.GATEWAY}`);
			console.log(green("Successfully connected to websocket.")); // TODO(fox-cat): Remove these types of messages or make them optional with a debug parameter

			for await (const msg of this.sock) {
				if(typeof msg === "string") {
					this.handleWSMessage(JSON.parse(msg));
				} else if(isWebSocketCloseEvent(msg)) {
					this.onClose(msg);
				}
			}
		} catch(err) {
			console.error(bold('Could not connect to websocket!') + "\n" + red(err.stack));
		}
	}

	private heartbeat(int: any) {
		setInterval(() => {
	    	this.sock.send(JSON.stringify({
	        	op: 1,
				d: this.sequence
			}))
	    }, int)
	}

	private async identify() {
		await this.sock.send(JSON.stringify({
			op: 2,
			d: {
				token: this.token,
				properties: {
					"$os": "linux",
					"$browser": "coward",
					"$device": "coward"
				}
			}
		}))
	}

	private async handleWSMessage(message: any) {
		switch(message.op) {
			case 0:
				this.sequence = message.s;
				break;
			case 1:
				this.sock.send(JSON.stringify({
					op: 1,
					d: this.sequence
				}))
				break;
			case 10:
				this.heartbeat(message.d.heartbeat_interval);
				this.identify();
				break;
		}

		switch(message.t) {
			case "READY":
				/**
				 * Fired when the Client is ready
				 * @event Client#ready
				 */
				this.client.emit("ready", null);
				break;
			case "MESSAGE_CREATE":
				this.client.emit("messageCreate", new Message(message.d, this.client));
				break;
		}
	}

	private async createError(str: string) {
		console.error(red(bold("[ COWARD ] Error: ")) + reset(str))
	}

	private async onClose(message: any) {
		if(message.code) {
			switch(message.code) {
				case 4000:
					this.createError("Unkown Error: We're not sure what went wrong. Try reconnecting?");
					break;
				case 4001:
					this.createError("Unknown Opcode: You sent an invalid Gateway opcode or an invalid payload for an opcode. Don't do that!");
					break;
				case 4002:
					this.createError("Decode Error: You sent an invalid payload to us. Don't do that!");
					break;
				case 4003:
					this.createError("Not Authenticated: You sent us a payload prior to identifying.");
					break;
				case 4004:
					this.createError(`Authentication Failed: The account token sent with your identify payload is incorrect. (${this.token})`);
					break;
				case 4005:
					this.createError("Already Authenticated: You sent more than one identify payload. Don't do that!")
					break;
				case 4007:
					this.createError("Invalid `seq`: The sequence sent when resuming the session was invalid. Reconnect and start a new session.")
					break;
				case 4008:
					this.createError("Rate Limited: Woah nelly! You're sending payloads to us too quickly. Slow it down! You will be disconnected on receiving this.");
					break;
				case 4009:
					this.createError("Session Timed Out: Your session timed out. Reconnect and start a new one.");
					break;
				case 4010:
					this.createError("Invalid Shard: You sent us an invalid shard when identifying.");
					break;
				case 4011:
					this.createError("Sharding Required: The session would have handled too many guilds - you are required to shard your connection in order to connect.");
					break;
				case 4012:
					this.createError("Invalid API Version: You sent an invalid version for the gateway.");
					break;
				case 4013:
					this.createError("Invalid Intent(s): You sent an invalid intent for a Gateway Intent. You may have incorrectly calculated the bitwise value.");
					break;
				case 4014:
					this.createError("Disallowed Intent(s): You sent a disallowed intent for a Gateway Intent. You may have tried to specify an intent that you have not enabled or are not whitelisted for.");
					break;
			}
		}
		if(!this.sock.isClosed) this.sock.close(1000);
	}
}
