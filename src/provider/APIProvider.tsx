import { createContext, type JSX } from 'react';
import { Guild } from '../types';
import { useGuilds } from './hooks/useGuilds';
import { useGuild } from './hooks/useGuild';
import { useModules } from './hooks/useModules';
import { useLogs } from './hooks/useLogs';
import { useUsers } from './hooks/useUsers';

export interface APIProviderState {
  guilds: Guild[];
  updateGuilds: () => Promise<void>;
  guild: ReturnType<typeof useGuild>;
  modules: ReturnType<typeof useModules>;
  users: ReturnType<typeof useUsers>;
  logs: ReturnType<typeof useLogs>;
}

export const APIProviderContext = createContext<APIProviderState | null>(null);

export function APIProvider({ children }: {children: React.ReactNode}): JSX.Element {
  const guildsHook = useGuilds();
  const guild = useGuild();
  const modules = useModules(guild.data);
  const users = useUsers();
  const logs = useLogs();

  return (
    <APIProviderContext.Provider value={{
      ...guildsHook,
      guild,
      modules,
      users,
      logs,
    }}>
      {children}
    </APIProviderContext.Provider>
  );
};