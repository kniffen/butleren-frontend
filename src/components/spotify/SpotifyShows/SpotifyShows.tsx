import { useContext, useMemo, useState, type JSX } from 'react';
import { useAPI } from '../../../provider/hooks/useAPI';
import type { SpotifyShow, SpotifyNotificationConfig } from '../../../types';
import './SpotifyShows.scss';
import { LoadingCard } from '../../LoadingCard/LoadingCard';
import { SpotifyShowsModalContext } from '../SpotifyShowsModal/SpotifyShowsModal';

interface SpotifyShowTableItem {
  name: string;
  channel: string;
  role: string;
  spotifyShow: SpotifyShow;
  notificationConfig: SpotifyNotificationConfig;
}

export function SpotifyShows(): JSX.Element {
  const { spotify, guild } = useAPI();
  const [isDeleting, setIsDeleting] = useState(false);
  const { setNotificationConfig, setSpotifyShow } = useContext(SpotifyShowsModalContext)!;

  const tableItems = useMemo<SpotifyShowTableItem[]>(() => {
    return spotify.shows.map((show) => {
      const discordChannel = guild.data?.channels?.find((c) => c.id === show.notificationConfig.notificationChannelId);
      const discordRole = guild.data?.roles?.find((r) => r.id === show.notificationConfig.notificationRoleId);

      return {
        name:               show.name,
        channel:            discordChannel?.name || 'N/A',
        role:               discordRole?.name || '',
        spotifyShow:        show,
        notificationConfig: show.notificationConfig,
      };
    });
  }, [spotify.shows, guild.data]);

  const onEditHandler = (item: SpotifyShowTableItem): void => {
    if (!isDeleting) {
      setNotificationConfig(item.notificationConfig);
      setSpotifyShow(item.spotifyShow);
    }
  };

  const onDeleteHandler = async (id: string): Promise<void> => {
    if (!isDeleting) {
      setIsDeleting(true);
      await spotify.deleteShow(id);
      await spotify.updateShows();
      setIsDeleting(false);
    }
  };

  if (spotify.isLoading) {
    return <div className="spotify-shows-loading-container">
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
    </div>;
  }

  return <div className="spotify-shows-container">
    <div className="spotify-shows">
      <div className="spotify-shows__row spotify-shows-header">
        <span>Broadcaster</span>
        <span>Notification channel</span>
        <span>Notification role</span>
        <span>Actions</span>
      </div>

      {tableItems.map((item) => (
        <div className="spotify-shows__row spotify-show" key={item.spotifyShow.showId}>
          <span>{item.name}</span>
          <span>{item.channel}</span>
          <span>{item.role}</span>
          <span className="spotify-show__actions">
            <span className="material-symbols-outlined" onClick={() => { onEditHandler(item);}}>edit_square</span>
            <span className="material-symbols-outlined delete" onClick={() => { onDeleteHandler(item.spotifyShow.showId);}}>delete</span>
          </span>
        </div>)
      )}
    </div>

    <AddSpotifyShowButton />
  </div>;
}

const AddSpotifyShowButton = (): JSX.Element => {
  const { setNotificationConfig } = useContext(SpotifyShowsModalContext)!;

  const onClickHandler = (): void => {
    setNotificationConfig({
      showId:                '',
      notificationChannelId: '',
      notificationRoleId:    '',
    });
  };

  return <div className="add-spotify-show-button-wrapper">
    <button className="add-spotify-show-button" onClick={onClickHandler}>Add channel</button>
  </div>;
};