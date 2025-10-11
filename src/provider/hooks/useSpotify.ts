import { useCallback, useState } from 'react';
import { Guild, SpotifyShow, SpotifyNotificationConfig } from '../../types';

export interface SpotifyHook {
  shows: SpotifyShow[];
  isLoading: boolean;
  getShows: () => Promise<SpotifyShow[]>;
  updateShows: () => Promise<void>;
  postShow: (requestBody: SpotifyNotificationConfig) => Promise<boolean>;
  deleteShow: (id: string) => Promise<boolean>;
}

export const useSpotify = (guild: Guild | null): SpotifyHook => {
  const [shows, setShows] = useState<SpotifyShow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getShows = useCallback(async (): Promise<SpotifyShow[]> => {
    if (!guild) {
      return [];
    }

    const res = await fetch(`/api/spotify/${guild.id}/shows`);
    if (!res.ok) {
      return [];
    }

    const data = await res.json() as SpotifyShow[];
    return data;
  }, [guild]);

  const updateShows = useCallback(async () => {
    if (!guild) {
      return;
    }

    setIsLoading(true);
    const data = await getShows();
    setShows(data);
    setIsLoading(false);
  }, [guild, getShows]);

  const postShow = useCallback(async (requestBody: SpotifyNotificationConfig): Promise<boolean> => {
    if (!guild) {
      return false;
    }

    const res = await fetch(
      `/api/spotify/${guild.id}/shows`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(requestBody)
      }
    );

    return res.ok;
  }, [guild]);

  const deleteShow = useCallback(async (id: string) => {
    if (!guild) {
      return false;
    }

    const res = await fetch(
      `/api/spotify/${guild.id}/shows/${id}`,
      { method: 'DELETE',      }
    );

    return res.ok;
  }, [guild]);

  return {
    shows,
    isLoading,
    getShows,
    updateShows,
    postShow,
    deleteShow
  };
};