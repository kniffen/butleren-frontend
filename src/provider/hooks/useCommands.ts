import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Guild, Command } from '../../types';

export interface ModulesHook {
  data: Command[];
  isLoading: boolean;
  update: () => Promise<void>;
}

export const useCommands = (guild: Guild | null): ModulesHook => {
  const [data, setData] = useState<Command[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const update = useCallback(async () => {
    if (!guild) {
      return;
    }

    setIsLoading(true);
    const res = await fetch(`/api/commands/${guild.id}`);
    if (!res.ok) {
      setData([]);
      setIsLoading(false);
      return;
    }

    const data = await res.json() as Command[];
    setData(data);
    setIsLoading(false);
  }, [guild]);

  useEffect(() => {
    update();
  }, [guild]);

  return useMemo(() => ({
    data,
    isLoading,
    update,
  }), [data, isLoading, update]);
};