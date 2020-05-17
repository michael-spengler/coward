import {
	connectWebSocket,
	isWebSocketCloseEvent,
	WebSocket,

	green, red, blue, bold, reset
} from "../../../deps.ts";
import { Versions, Discord, Endpoints } from "../../util/Constants.ts";
import { fear } from "../../util/Fear.ts";

import { Client } from "../../Client.ts";
import { Guild, GuildMember, Message, User, Role, Channel } from "../../Classes.ts";
import { handleEvent } from "./EventHandler.ts"

export default class Gateway {
	public sock!: WebSocket;

	private sequence: any = null
	private sessionID: string = ""
	private receivedAck: boolean = true
	private status: string = "connecting"

	constructor(private token: string, private client: Client) {}

	public async connect(): Promise<void> {
		try {
			this.sock = await connectWebSocket(`${Discord.GATEWAY}/v=${Versions.GATEWAY}`);

			if(this.status === "resuming") {
				this.status = "handshaking"
				await this.sock.send(JSON.stringify({
					op: 6,
					d: {
						token: this.token,
						session_id: this.sessionID,
						seq: this.sequence
					}
				}))
			} else {
				this.status = "handshaking"
				await this.singleHeartbeat()
				await this.identify()
			}

			for await (const msg of this.sock) {
				if (typeof msg === "string") {
					this.handleWSMessage(JSON.parse(msg));
				} else if (isWebSocketCloseEvent(msg)) {
					fear("error", "websocket was closed");
					this.onClose(msg);
				}
			}
		} catch (err) {
			fear("error", "could not connect to websocket \n" + red(err.stack))
		}
	}

	private async attemptReconnect() {
		this.status = "resuming"
		await this.close()
		await this.connect()
	}

	private singleHeartbeat() {
		this.sock.send(JSON.stringify({
			op: 1,
			d: this.sequence,
		}));
		this.receivedAck = false
	}

	private heartbeat(int: any) {
		setInterval(() => {
			try {
				if(this.receivedAck) {
					this.singleHeartbeat()
				} else {
					this.attemptReconnect()
				}
			} catch (err) {
				this.attemptReconnect()
				fear("error", "something went wrong when trying to heartbeat, attempting reconnect: \n" + red(err.stack))
			}
		}, int);
	}

	private async identify() {
		await this.sock.send(JSON.stringify({
			op: 2,
			d: {
				token: this.token,
				properties: {
					"$os": "linux",
					"$browser": "coward",
					"$device": "coward",
				},
			},
		}));
	}

	public async modifyPresence(settings: any) {
		await this.sock.send(JSON.stringify({
			op: 3,
			d: {
				afk: false,
				game: settings.game,
				status: settings.status,
				since: (settings.status === "idle") ? Date.now() : 0
			}
		}))
	}

	private async handleWSMessage(message: any) {
		switch (message.op) {
			case 0:
				this.sequence = message.s;
				break;
			case 1:
				this.sock.send(JSON.stringify({
					op: 1,
					d: this.sequence,
				}));
				break;
			case 7:
			case 9:
				this.attemptReconnect()
				break
			case 10:
				this.heartbeat(message.d.heartbeat_interval)
				break;
			case 11:
				this.receivedAck = true
				break
		}

		handleEvent(this.client, message)

	}

	private async close() {
		this.receivedAck = true
		if (!this.sock.isClosed) this.sock.close(1000)
	}

	private async onClose(message: any) {
		this.status = "disconnected"
		if (message.code) {
			switch (message.code) {
				case 4000:
					fear("error",
						"Unkown Error: We're not sure what went wrong. Try reconnecting?",
					);
					break;
				case 4001:
					fear("error",
						"Unknown Opcode: You sent an invalid Gateway opcode or an invalid payload for an opcode. Don't do that!",
					);
					break;
				case 4002:
					fear("error",
						"Decode Error: You sent an invalid payload to us. Don't do that!",
					);
					break;
				case 4003:
					fear("error",
						"Not Authenticated: You sent us a payload prior to identifying.",
					);
					break;
				case 4004:
					fear("error",
						`Authentication Failed: The account token sent with your identify payload is incorrect. (${this.token})`,
					);
					break;
				case 4005:
					fear("error",
						"Already Authenticated: You sent more than one identify payload. Don't do that!",
					);
					break;
				case 4007:
					fear("error",
						"Invalid `seq`: The sequence sent when resuming the session was invalid. Reconnect and start a new session.",
					);
					break;
				case 4008:
					fear("error",
						"Rate Limited: Woah nelly! You're sending payloads to us too quickly. Slow it down! You will be disconnected on receiving this.",
					);
					break;
				case 4009:
					fear("error",
						"Session Timed Out: Your session timed out. Reconnect and start a new one.",
					);
					break;
				case 4010:
					fear("error",
						"Invalid Shard: You sent us an invalid shard when identifying.",
					);
					break;
				case 4011:
					fear("error",
						"Sharding Required: The session would have handled too many guilds - you are required to shard your connection in order to connect.",
					);
					break;
				case 4012:
					fear("error",
						"Invalid API Version: You sent an invalid version for the gateway.",
					);
					break;
				case 4013:
					fear("error",
						"Invalid Intent(s): You sent an invalid intent for a Gateway Intent. You may have incorrectly calculated the bitwise value.",
					);
					break;
				case 4014:
					fear("error",
						"Disallowed Intent(s): You sent a disallowed intent for a Gateway Intent. You may have tried to specify an intent that you have not enabled or are not whitelisted for.",
					);
					break;
			}
		}
		this.close()
	}
}
