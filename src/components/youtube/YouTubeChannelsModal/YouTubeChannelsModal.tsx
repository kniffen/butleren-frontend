import { createContext, useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { Modal } from '../../Modal/Modal';
import { useAPI } from '../../../provider/hooks/useAPI';
import type { YouTubeChannel, YouTubeNotificationConfig, YouTubeSearchResultItem } from '../../../types';
import { YouTubeSearchForm } from '../YouTubeSearchForm/YouTubeSearchForm';
import { YouTubeChannelForm } from '../YouTubeChannelForm/YouTubeChannelForm';
import { YouTubeChannels } from '../YouTubeChannels/YouTubeChannels';
import './YouTubeChannelsModal.scss';

export interface YouTubeProviderState {
  youtubeChannel: YouTubeChannel | null;
  setYouTubeChannel: (channel: YouTubeChannel | null) => void;
  notificationConfig: YouTubeNotificationConfig | null;
  setNotificationConfig: (config: YouTubeNotificationConfig | null) => void;
  searchResults: YouTubeSearchResultItem[];
  setSearchResults: (results: YouTubeSearchResultItem[]) => void;
}

export const YouTubeChannelsModalContext = createContext<YouTubeProviderState | null>(null);

export function YouTubeChannelsModal(): JSX.Element {
  const { youtube } = useAPI();
  const [youtubeChannel, setYouTubeChannel] = useState<YouTubeChannel| null>(null);
  const [notificationConfig, setNotificationConfig] = useState<YouTubeNotificationConfig | null>(null);
  const hasInitialized = useRef(false);
  const [searchResults, setSearchResults] = useState<YouTubeSearchResultItem[]>([]);

  const title = useMemo(() => {
    if (youtubeChannel) {
      return 'Edit channel';
    }

    if (notificationConfig) {
      return 'Add channel';
    }

    return 'YouTube channels';
  }, [youtubeChannel, notificationConfig]);

  useEffect(() => {
    if (!hasInitialized.current) {
      youtube.updateChannels();
      hasInitialized.current = true;
    }
  }, [youtube]);

    return (
      <YouTubeChannelsModalContext.Provider value={{
        youtubeChannel,
        setYouTubeChannel,
        notificationConfig,
        setNotificationConfig,
        searchResults,
        setSearchResults,
      }}>
        <Modal title={title} buttonText="Manage channels" onClose={() => {setYouTubeChannel(null); setNotificationConfig(null);}}>
          {notificationConfig
            ? <div className="youtube-channel-form-container">
                <YouTubeSearchForm />
                <hr />
                <YouTubeChannelForm />
              </div>
            : <YouTubeChannels />
          }
        </Modal>
      </YouTubeChannelsModalContext.Provider>
    );
}
