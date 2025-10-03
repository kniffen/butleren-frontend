import { createContext, type JSX } from 'react';
import { useGuilds } from './hooks/useGuilds';
import { useGuild } from './hooks/useGuild';
import { useModules } from './hooks/useModules';
import { useCommands } from './hooks/useCommands';
import { useLogs } from './hooks/useLogs';
import { useUsers } from './hooks/useUsers';
import { useKick } from './hooks/useKick';

export interface APIProviderState {
  guilds:   ReturnType<typeof useGuilds>;
  guild:    ReturnType<typeof useGuild>;
  modules:  ReturnType<typeof useModules>;
  commands: ReturnType<typeof useCommands>;
  users:    ReturnType<typeof useUsers>;
  logs:     ReturnType<typeof useLogs>;
  kick:     ReturnType<typeof useKick>;
}

export const APIProviderContext = createContext<APIProviderState | null>(null);

export function APIProvider({ children }: {children: React.ReactNode}): JSX.Element {
  const guilds = useGuilds();
  const guild = useGuild();
  const modules = useModules(guild.data);
  const commands = useCommands(guild.data);
  const users = useUsers();
  const logs = useLogs();
  const kick = useKick(guild.data);

  return (
    <APIProviderContext.Provider value={{
      guilds,
      guild,
      modules,
      commands,
      users,
      logs,
      kick,
    }}>
      {children}
    </APIProviderContext.Provider>
  );
};