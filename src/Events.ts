import { Evt } from "../deps.ts";

import { Channel } from "./structures/Channel.ts"
import { Guild } from "./structures/Guild.ts"
import { GuildMember } from "./structures/GuildMember.ts"
import { GuildEmoji } from "./structures/GuildEmoji.ts"
import { ReactionCustomEmoji } from "./structures/ReactionCustomEmoji.ts"
import { ReactionStandardEmoji } from "./structures/ReactionStandardEmoji.ts"
import { Message } from "./structures/Message.ts"
import { User } from "./structures/User.ts"
import { Role } from "./structures/Role.ts"


/** Fired when the client is ready. */
export const ready = new Evt();

/** Fired when a channel is created. */
export const channelCreate: Evt<{channel: Channel}> = new Evt<{channel: Channel}>();

/** Fired when a channel is updated. */
export const channelUpdate: Evt<{channel: Channel}> = new Evt<{channel: Channel}>();

/** Fired when a channel is deleted. */
export const channelDelete: Evt<{channel: Channel}> = new Evt<{channel: Channel}>();

/** Fired when a message is pinned or unpinned in a text channel. This is not fired when a pinned message is deleted. */
export const channelPinsUpdate: Evt<{channel: Channel}> = new Evt<{channel: Channel}>();

/**
 * Fired when
 *	- The client is initally connecting.
 *	- A guild becomes available to the client.
 *	- The client joins a guild.
 */
export const guildCreate: Evt<{guild: Guild}> = new Evt<{guild: Guild}>();

/**
 * Fired when
 *	- The client leaves or is removed from a guild.
 *	- A guild becomes unavailable.
 */
export const guildDelete: Evt<{guild: Guild}> = new Evt<{guild: Guild}>();

/** Fired when a user is banned from a guild. */
export const guildBanAdd: Evt<{guild: Guild, user: User}> = new Evt<{guild: Guild, user: User}>();

/** Fired when a user is unbanned from a guild. */
export const guildBanRemove: Evt<{guild: Guild, user: User}> = new Evt<{guild: Guild, user: User}>();

/** Fired when a guild's emojis have been updated. */
export const guildEmojisUpdate: Evt<{guild: Guild, emojis: Array<GuildEmoji>}> = new Evt<{guild: Guild, emojis: Array<GuildEmoji>}>();

/** Fired when a guild's integrations are updated. */
export const guildIntegrationsUpdate: Evt<{guild: Guild}> = new Evt<{guild: Guild}>();

/** Fired when a new user joins a guild. */
export const guildMemberAdd: Evt<{guild: Guild, member: GuildMember}> = new Evt<{guild: Guild, member: GuildMember}>();

/** Fired when a user leaves or is removed from a guild. */
export const guildMemberRemove: Evt<{guild: Guild, member: GuildMember}> = new Evt<{guild: Guild, member: GuildMember}>();

/** Fired when a guild member is updated. */
//TODO: Is there a better way of doing this? :v
export const guildMemberUpdate: Evt<{guild: Guild, member: GuildMember, oldMember: GuildMember}> = new Evt<{guild: Guild, member: GuildMember, oldMember: GuildMember}>();

//TODO: evtGuildMemberChunk: https://discord.com/developers/docs/topics/gateway#guild-members-chunk

/** Fired when a guild role is created. */
export const guildRoleCreate: Evt<{guild: Guild, role: Role}> = new Evt<{guild: Guild, role: Role}>();

/** Fired when a guild role is updated. */
export const guildRoleUpdate: Evt<{guild: Guild, role: Role}> = new Evt<{guild: Guild, role: Role}>();

/** Fired when a guild role is deleted. */
export const guildRoleDelete: Evt<{guild: Guild, role: Role}> = new Evt<{guild: Guild, role: Role}>();

// TODO: Invites (see https://discord.com/developers/docs/topics/gateway#invites)

/** Fired when a message is created. */
export const messageCreate: Evt<{message: Message}> = new Evt<{message: Message}>();

/** Fired when a message is updated. */
export const messageUpdate: Evt<{message: Message}> = new Evt<{message: Message}>();

/** Fired when a message is deleted. */
export const messageDelete: Evt<{messageID: string, channelID: string}> = new Evt<{messageID: string, channelID: string}>();

/** Fired when messages are deleted in bulk. */
export const messageDeleteBulk: Evt<{messageIDs: Array<string>, channelID: string}> = new Evt<{messageIDs: Array<string>, channelID: string}>();

/** TODO: Fired when a reaction is added to a message. */
export const messageReactionAdd: Evt<{user: User, channel: Channel, emoji: ReactionStandardEmoji | ReactionCustomEmoji, messageID: string}> = new Evt<{user: User, channel: Channel, emoji: ReactionStandardEmoji | ReactionCustomEmoji, messageID: string}>();

/** TODO: Fired when a reaction is removed from a message. */
export const messageReactionRemove: Evt<{user: User, channel: Channel, emoji: ReactionStandardEmoji | ReactionCustomEmoji, messageID: string}> = new Evt<{user: User, channel: Channel, emoji: ReactionStandardEmoji | ReactionCustomEmoji, messageID: string}>();

/** TODO: Fired when a user removes all reactions from a message. */
export const messageReactionRemoveAll: Evt<{channel: Channel, messageID: string}> = new Evt<{channel: Channel, messageID: string}>()

// TODO: Presence ...https://discord.com/developers/docs/topics/gateway#presence-update

/** Fired when a user starts typing in a channel. */
export const typingStart: Evt<{channel: Channel, userID: string, timestamp: number}> = new Evt<{channel: Channel, userID: string, timestamp: number}>()

// TODO: Voice ...https://discord.com/developers/docs/topics/gateway#voice