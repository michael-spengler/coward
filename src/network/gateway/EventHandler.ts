import { Client } from "../../Client.ts"
import { Guild, GuildMember, GuildEmoji, Message, User, Role, Channel } from "../../Classes.ts";

export function handleEvent(client: Client, message: any) {
	switch(message.t) {
		case "READY": {
			client.evtReady.post(undefined)
			break
		}
		case "CHANNEL_CREATE": {
			client.evtChannelCreate.post({channel: Channel.from(message.d, client)})
			break
		}
		case "CHANNEL_UPDATE": {
			client.evtChannelUpdate.post({channel: Channel.from(message.d, client)})
			break
		}
		case "CHANNEL_DELETE": {
			client.evtChannelDelete.post({channel: Channel.from(message.d, client)})
			break
		}
		case "CHANNEL_PINS_UPDATE": {
			client.evtChannelPinsUpdate.post({channel: Channel.from(message.d, client)})
			break
		}
		case "GUILD_CREATE": {
			const guild = new Guild(message.d, client)
			client.guilds.set(guild.id, guild)
			client.evtGuildCreate.post({guild: guild})
			break
		}
		case "GUILD_DELETE": {
			const guild = new Guild(message.d, client)
			client.guilds.delete(guild.id)
			client.evtGuildDelete.post({guild: guild})
			break
		}
		case "GUILD_BAN_ADD": {
			const guild = client.guilds.get(message.d.guild_id)
			if(guild !== undefined) client.evtGuildBanAdd.post({guild: guild, user: new User(message.d.user, client)})
			break
		}
		case "GUILD_BAN_REMOVE": {
			const guild = client.guilds.get(message.d.guild_id)
			if(guild !== undefined) client.evtGuildBanRemove.post({guild: guild, user: new User(message.d.user, client)})
			break
		}
		case "GUILD_EMOJIS_UPDATE": {
			const guild = client.guilds.get(message.d.guild_id)
			let emojis = new Array<GuildEmoji>()
			for(const emoji of message.d.emojis) emojis.push(new GuildEmoji(emoji, client))
			if(guild !== undefined) client.evtGuildEmojisUpdate.post({guild: guild, emojis: emojis})
			break
		}
		case "GUILD_INTEGRATIONS_UPDATE": {
			const guild = client.guilds.get(message.d.guild_id)
			if(guild !== undefined) client.evtGuildIntegrationsUpdate.post({guild: guild})
			break
		}
		case "GUILD_MEMBER_ADD": {
			let guild = client.guilds.get(message.d.guild_id)
			if(guild == undefined) break

			const member = new GuildMember(message.d, client)
			guild.members.set(member.user.id, member)
			client.guilds.set(guild.id, guild)

			client.evtGuildMemberAdd.post({guild: guild, member: member})
			break
		}
		case "GUILD_MEMBER_REMOVE": {
			let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break

			let member = guild.members.get(message.d.user.id)
			if(member == undefined) break

			guild.members.delete(member.user.id)
			client.guilds.set(guild.id, guild)

			client.evtGuildMemberRemove.post({guild: guild, member: member})
			break
		}
		case "GUILD_MEMBER_UPDATE": {
			let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break
			let oldMember = guild.members.get(message.d.user.id)

			if(oldMember == undefined) break
			let member = oldMember
			member.user = message.d.user
			member.roles = message.d.roles
			member.nick = message.d.nick || null
			member.premiumSince = message.d.premium_since || null

			client.evtGuildMemberUpdate.post({guild: guild, member: member, oldMember: oldMember})
			break
		}
		// TODO: case "GUILD_MEMBER_CHUNK"
		case "GUILD_ROLE_CREATE": {
			let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break
			let role = new Role(message.d.role, client)

			guild.roles.set(role.id, role)
			client.guilds.set(guild.id, guild)

			client.evtGuildRoleCreate.post({guild: guild, role: role})
			break
		}
		case "GUILD_ROLE_UPDATE": {
		 	let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break
			let role = new Role(message.d.role, client)

			guild.roles.set(role.id, role)
			client.guilds.set(guild.id, guild)

			client.evtGuildRoleUpdate.post({guild: guild, role: new Role(message.d.role, client)})
			break
		}
		case "GUILD_ROLE_DELETE":  {
			let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break
			let role = guild.roles.get(message.d.role_id)

			if(role == undefined) break
			guild.roles.delete(role.id)
			client.guilds.set(guild.id, guild)

			client.evtGuildRoleDelete.post({guild: guild, role: role})
			break
		}
		// TODO: invites
		case "MESSAGE_CREATE": {
			client.evtMessageCreate.post({message: new Message(message.d, client)})
			break
		}
		case "MESSAGE_UPDATE": {
			if(!message.d.author) break
			client.evtMessageUpdate.post({message: new Message(message.d, client)})
			break
		}
		case "MESSAGE_DELETE": {
			client.evtMessageDelete.post({messageID: message.d.id, channelID: message.d.channel_id})
			break
		}
		case "MESSAGE_DELETE_BULK": {
			client.evtMessageDeleteBulk.post({messageIDs: message.d.ids, channelID: message.d.channel_id})
			break
		}
		// TODO: MESSAGE_REACTION_ADD, MESSAGE_REACTION_REMOVE, MESSAGE_REACTION_REMOVE_ALL
		// TODO: TYPING_START
	}
}
