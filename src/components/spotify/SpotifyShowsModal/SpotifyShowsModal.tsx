import { createContext, useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { Modal } from '../../Modal/Modal';
import { useAPI } from '../../../provider/hooks/useAPI';
import type { SpotifyShow, SpotifyNotificationConfig } from '../../../types';
import { SearchForm } from '../../SearchForm/SearchForm';
import { SpotifyShowForm } from '../SpotifyShowForm/SpotifyShowForm';
import { SpotifyShows } from '../SpotifyShows/SpotifyShows';
import './SpotifyShowsModal.scss';

export interface SpotifyProviderState {
  spotifyShow: SpotifyShow | null;
  setSpotifyShow: (show: SpotifyShow | null) => void;
  notificationConfig: SpotifyNotificationConfig | null;
  setNotificationConfig: (config: SpotifyNotificationConfig | null) => void;
}

export const SpotifyShowsModalContext = createContext<SpotifyProviderState | null>(null);

export function SpotifyShowsModal(): JSX.Element {
  const { spotify } = useAPI();
  const [spotifyShow, setSpotifyShow] = useState<SpotifyShow| null>(null);
  const [notificationConfig, setNotificationConfig] = useState<SpotifyNotificationConfig | null>(null);
  const hasInitialized = useRef(false);

  const title = useMemo(() => {
    if (spotifyShow) {
      return 'Edit show';
    }

    if (notificationConfig) {
      return 'Add show';
    }

    return 'Spotify shows';
  }, [spotifyShow, notificationConfig]);

  useEffect(() => {
    if (!hasInitialized.current) {
      spotify.updateShows();
      hasInitialized.current = true;
    }
  }, [spotify]);

    return (
      <SpotifyShowsModalContext.Provider value={{
        spotifyShow,
        setSpotifyShow,
        notificationConfig,
        setNotificationConfig,
      }}>
        <Modal title={title} buttonText="Manage shows" onClose={() => {setSpotifyShow(null); setNotificationConfig(null);}}>
          {notificationConfig
            ? <div className="spotify-show-form-container">
                <SearchForm
                  initialQuery={spotifyShow?.name}
                  service="spotify"
                  onSelect={(result) => setNotificationConfig({
                    ...notificationConfig,
                    showId: result.id,
                  })}
                />
                <hr />
                <SpotifyShowForm />
              </div>
            : <SpotifyShows />
          }
        </Modal>
      </SpotifyShowsModalContext.Provider>
    );
}
