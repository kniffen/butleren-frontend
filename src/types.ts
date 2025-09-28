import { schemas } from '@kniffen/butleren-api-contract';
import { z } from 'zod';

export type Guild          = z.infer<typeof schemas.Guild>;
export type GuildSettings  = z.infer<typeof schemas.GuildSettings>;
export type Module         = z.infer<typeof schemas.Module>;
export type ModuleSettings = z.infer<typeof schemas.ModuleSettings>;
export type LogEntry       = z.infer<typeof schemas.LogEntry>;