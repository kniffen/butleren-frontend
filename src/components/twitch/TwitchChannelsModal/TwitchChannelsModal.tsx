import { createContext, useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { Modal } from '../../Modal/Modal';
import { useAPI } from '../../../provider/hooks/useAPI';
import type { TwitchChannel, TwitchNotificationConfig, TwitchSearchResultItem } from '../../../types';
import { TwitchSearchForm } from '../TwitchSearchForm/TwitchSearchForm';
import { TwitchChannelForm } from '../TwitchChannelForm/TwitchChannelForm';
import { TwitchChannels } from '../TwitchChannels/TwitchChannels';
import './TwitchChannelsModal.scss';

export interface TwitchProviderState {
  twitchChannel: TwitchChannel | null;
  setTwitchChannel: (channel: TwitchChannel | null) => void;
  notificationConfig: TwitchNotificationConfig | null;
  setNotificationConfig: (config: TwitchNotificationConfig | null) => void;
  searchResults: TwitchSearchResultItem[];
  setSearchResults: (results: TwitchSearchResultItem[]) => void;
}

export const TwitchChannelsModalContext = createContext<TwitchProviderState | null>(null);

export function TwitchChannelsModal(): JSX.Element {
  const { twitch } = useAPI();
  const [twitchChannel, setTwitchChannel] = useState<TwitchChannel| null>(null);
  const [notificationConfig, setNotificationConfig] = useState<TwitchNotificationConfig | null>(null);
  const hasInitialized = useRef(false);
  const [searchResults, setSearchResults] = useState<TwitchSearchResultItem[]>([]);

  const title = useMemo(() => {
    if (twitchChannel) {
      return 'Edit channel';
    }

    if (notificationConfig) {
      return 'Add channel';
    }

    return 'Twitch channels';
  }, [twitchChannel, notificationConfig]);

  useEffect(() => {
    if (!hasInitialized.current) {
      twitch.updateChannels();
      hasInitialized.current = true;
    }
  }, [twitch]);

    return (
      <TwitchChannelsModalContext.Provider value={{
        twitchChannel,
        setTwitchChannel,
        notificationConfig,
        setNotificationConfig,
        searchResults,
        setSearchResults,
      }}>
        <Modal title={title} buttonText="Manage channels" onClose={() => {setTwitchChannel(null); setNotificationConfig(null);}}>
          {notificationConfig
            ? <div className="twitch-channel-form-container">
                <TwitchSearchForm />
                <hr />
                <TwitchChannelForm />
              </div>
            : <TwitchChannels />
          }
        </Modal>
      </TwitchChannelsModalContext.Provider>
    );
}
