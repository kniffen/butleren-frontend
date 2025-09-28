import { createContext, type JSX } from 'react';
import { Guild } from '../types';
import { useGuilds } from './hooks/useGuilds';
import { useGuild } from './hooks/useGuild';
import { useModules } from './hooks/useModules';
import { useLogger } from './hooks/useLogger';
import { useUsers } from './hooks/useUsers';

export interface APIProviderState {
  guilds: Guild[];
  updateGuilds: () => Promise<void>;
  guild: ReturnType<typeof useGuild>;
  modules: ReturnType<typeof useModules>;
  users: ReturnType<typeof useUsers>;
  logger: ReturnType<typeof useLogger>;
}

export const APIProviderContext = createContext<APIProviderState | null>(null);

export function APIProvider({ children }: {children: React.ReactNode}): JSX.Element {
  const guildsHook = useGuilds();
  const guild = useGuild();
  const modules = useModules(guild.data);
  const users = useUsers();
  const logger = useLogger();

  return (
    <APIProviderContext.Provider value={{
      ...guildsHook,
      guild,
      modules,
      users,
      logger,
    }}>
      {children}
    </APIProviderContext.Provider>
  );
};