import { Client } from "../../Client.ts"
import { Guild, GuildMember, GuildEmoji, Message, User, Role, Channel } from "../../Classes.ts";

export function handleEvent(client: Client, message: any) {
	switch(message.t) {
		case "READY": {
			client.evt.ready.post(undefined)
			break
		}
		case "CHANNEL_CREATE": {
			client.evt.channelCreate.post({channel: Channel.from(message.d, client)})
			break
		}
		case "CHANNEL_UPDATE": {
			client.evt.channelUpdate.post({channel: Channel.from(message.d, client)})
			break
		}
		case "CHANNEL_DELETE": {
			client.evt.channelDelete.post({channel: Channel.from(message.d, client)})
			break
		}
		case "CHANNEL_PINS_UPDATE": {
			client.evt.channelPinsUpdate.post({channel: Channel.from(message.d, client)})
			break
		}
		case "GUILD_CREATE": {
			const guild = new Guild(message.d, client)
			client.guilds.set(guild.id, guild)
			client.evt.guildCreate.post({guild: guild})
			break
		}
		case "GUILD_DELETE": {
			const guild = new Guild(message.d, client)
			client.guilds.delete(guild.id)
			client.evt.guildDelete.post({guild: guild})
			break
		}
		case "GUILD_BAN_ADD": {
			const guild = client.guilds.get(message.d.guild_id)
			if(guild !== undefined) client.evt.guildBanAdd.post({guild: guild, user: new User(message.d.user, client)})
			break
		}
		case "GUILD_BAN_REMOVE": {
			const guild = client.guilds.get(message.d.guild_id)
			if(guild !== undefined) client.evt.guildBanRemove.post({guild: guild, user: new User(message.d.user, client)})
			break
		}
		case "GUILD_EMOJIS_UPDATE": {
			const guild = client.guilds.get(message.d.guild_id)
			let emojis = new Array<GuildEmoji>()
			for(const emoji of message.d.emojis) emojis.push(new GuildEmoji(emoji, client))
			if(guild !== undefined) client.evt.guildEmojisUpdate.post({guild: guild, emojis: emojis})
			break
		}
		case "GUILD_INTEGRATIONS_UPDATE": {
			const guild = client.guilds.get(message.d.guild_id)
			if(guild !== undefined) client.evt.guildIntegrationsUpdate.post({guild: guild})
			break
		}
		case "GUILD_MEMBER_ADD": {
			let guild = client.guilds.get(message.d.guild_id)
			if(guild == undefined) break

			const member = new GuildMember(message.d, client)
			guild.members.set(member.user.id, member)
			client.guilds.set(guild.id, guild)

			client.evt.guildMemberAdd.post({guild: guild, member: member})
			break
		}
		case "GUILD_MEMBER_REMOVE": {
			let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break

			let member = guild.members.get(message.d.user.id)
			if(member == undefined) break

			guild.members.delete(member.user.id)
			client.guilds.set(guild.id, guild)

			client.evt.guildMemberRemove.post({guild: guild, member: member})
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

			client.evt.guildMemberUpdate.post({guild: guild, member: member, oldMember: oldMember})
			break
		}
		// TODO: case "GUILD_MEMBER_CHUNK"
		case "GUILD_ROLE_CREATE": {
			let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break
			let role = new Role(message.d.role, client)

			guild.roles.set(role.id, role)
			client.guilds.set(guild.id, guild)

			client.evt.guildRoleCreate.post({guild: guild, role: role})
			break
		}
		case "GUILD_ROLE_UPDATE": {
		 	let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break
			let role = new Role(message.d.role, client)

			guild.roles.set(role.id, role)
			client.guilds.set(guild.id, guild)

			client.evt.guildRoleUpdate.post({guild: guild, role: new Role(message.d.role, client)})
			break
		}
		case "GUILD_ROLE_DELETE":  {
			let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break
			let role = guild.roles.get(message.d.role_id)

			if(role == undefined) break
			guild.roles.delete(role.id)
			client.guilds.set(guild.id, guild)

			client.evt.guildRoleDelete.post({guild: guild, role: role})
			break
		}
		// TODO: invites
		case "MESSAGE_CREATE": {
			client.evt.messageCreate.post({message: new Message(message.d, client)})
			break
		}
		case "MESSAGE_UPDATE": {
			if(!message.d.author) break
			client.evt.messageUpdate.post({message: new Message(message.d, client)})
			break
		}
		case "MESSAGE_DELETE": {
			client.evt.messageDelete.post({messageID: message.d.id, channelID: message.d.channel_id})
			break
		}
		case "MESSAGE_DELETE_BULK": {
			client.evt.messageDeleteBulk.post({messageIDs: message.d.ids, channelID: message.d.channel_id})
			break
		}
		// TODO: MESSAGE_REACTION_ADD, MESSAGE_REACTION_REMOVE, MESSAGE_REACTION_REMOVE_ALL
		// TODO: TYPING_START
	}
}
