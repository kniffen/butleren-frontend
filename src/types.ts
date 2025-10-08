import { schemas } from '@kniffen/butleren-api-contract';
import { z } from 'zod';

export type Guild           = z.infer<typeof schemas.Guild>;
export type GuildSettings   = z.infer<typeof schemas.GuildSettings>;
export type Module          = z.infer<typeof schemas.Module>;
export type ModuleSettings  = z.infer<typeof schemas.ModuleSettings>;
export type Command         = z.infer<typeof schemas.Command>;
export type CommandSettings = z.infer<typeof schemas.CommandSettings>;
export type User            = z.infer<typeof schemas.User>;
export type LogEntry        = z.infer<typeof schemas.LogEntry>;

// Kick
export type KickChannel            = z.infer<typeof schemas.KickChannel>;
export type KickNotificationConfig = z.infer<typeof schemas.KickNotificationConfig>;
export type KickSearchResultItem   = z.infer<typeof schemas.KickSearchResultItem>;

// Twitch
export type TwitchChannel            = z.infer<typeof schemas.TwitchChannel>;
export type TwitchNotificationConfig = z.infer<typeof schemas.TwitchNotificationConfig>;
export type TwitchSearchResultItem   = z.infer<typeof schemas.TwitchSearchResultItem>;

// Spotify
export type SpotifyShow               = z.infer<typeof schemas.SpotifyShow>;
export type SpotifyNotificationConfig = z.infer<typeof schemas.SpotifyNotificationConfig>;
export type SpotifySearchResultItem   = z.infer<typeof schemas.SpotifySearchResultItem>;