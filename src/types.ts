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