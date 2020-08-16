import { RoleEventSubscriber, handleRoleEvent } from "./guild/Role.ts";
import { MemberEventSubscriber, handleMemberEvent } from "./guild/Member.ts";
import type { Payload } from "../../Payload.ts";
import {
  Guild,
  GuildCache,
  GuildHandler,
} from "../../../../structures/Guild.ts";
import type { User } from "../../../../structures/User.ts";
import type { Emitter } from "../../../../util/Emitter.ts";
import { GuildEmoji } from "../../../../structures/GuildEmoji.ts";

export interface GuildEventSubscriber
  extends RoleEventSubscriber, MemberEventSubscriber {
  guildCreate: Emitter<{ guild: Guild }>;
  guildUpdate: Emitter<{ guild: Guild }>;
  guildDelete: Emitter<{ guild: Guild }>;
  guildBanAdd: Emitter<{ guild: Guild; user: User }>;
  guildBanRemove: Emitter<
    { guild: Guild; user: User }
  >;
  guildEmojisUpdate: Emitter<
    { guild: Guild; emojis: Array<GuildEmoji> }
  >;
  guildIntegrationsUpdate: Emitter<
    { guild: Guild }
  >;
}

export function handleGuildEvent(
  message: Payload,
  delegates: Readonly<{
    cache: GuildCache;
    handler: GuildHandler;
    subscriber: GuildEventSubscriber;
  }>,
) {
  if (message.t.startsWith("GUILD_MEMBER_")) {
    handleMemberEvent(message, delegates);
    return;
  }
  if (message.t.startsWith("GUILD_ROLE_")) {
    handleRoleEvent(message, delegates);
    return;
  }
  const { cache, handler, subscriber } = delegates;
  const type = message.t;
  switch (type) {
    case "GUILD_CREATE":
      subscriber.guildCreate.emit(
        { guild: new Guild(message.d, cache, handler) },
      );
      return;
    case "GUILD_UPDATE":
      subscriber.guildUpdate.emit(
        { guild: new Guild(message.d, cache, handler) },
      );
      return;
    case "GUILD_DELETE":
      subscriber.guildDelete.emit(
        { guild: new Guild(message.d, cache, handler) },
      );
      return;
    case "GUILD_BAN_ADD": {
      const data = message.d as { guild_id: string; user: User };
      const guild = cache.getGuild(data.guild_id);
      if (guild == null) return;
      subscriber.guildBanAdd.emit(
        { guild: guild, user: data.user },
      );
      return;
    }
    case "GUILD_BAN_REMOVE": {
      const data = message.d as { guild_id: string; user: User };
      const guild = cache.getGuild(data.guild_id);
      if (guild == null) return;
      subscriber.guildBanRemove.emit(
        { guild: guild, user: data.user },
      );
      return;
    }
    case "GUILD_EMOJIS_UPDATE": {
      const data = message.d as { guild_id: string; emojis: unknown[] };
      const guild = cache.getGuild(data.guild_id);
      if (guild == null) return;

      const emojis = new Array<GuildEmoji>(
        ...data.emojis.map((emoji) => new GuildEmoji(emoji, guild, handler)),
      );
      subscriber.guildEmojisUpdate.emit({ guild: guild, emojis: emojis });
      return;
    }
    case "GUILD_INTEGRATIONS_UPDATE": {
      const data = message.d as { guild_id: string };
      const guild = cache.getGuild(data.guild_id);
      if (guild == null) return;
      subscriber.guildIntegrationsUpdate.emit({ guild: guild });
      return;
    }
  }
}
