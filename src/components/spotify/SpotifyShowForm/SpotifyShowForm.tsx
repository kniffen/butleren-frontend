import { useCallback, useContext, useState, type JSX } from 'react';
import type {  SpotifyNotificationConfig } from '../../../types';
import { useAPI } from '../../../provider/hooks/useAPI';
import { SpotifyShowsModalContext } from '../SpotifyShowsModal/SpotifyShowsModal';
import './SpotifyShowForm.scss';

export function SpotifyShowForm(): JSX.Element {
  const { guild, spotify } = useAPI();
  const { notificationConfig, setSpotifyShow, setNotificationConfig } = useContext(SpotifyShowsModalContext)!;
  const [isSaving, setIsSaving] = useState(false);

  const onSubmitHandler = useCallback(async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (isSaving) {
      return;
    }

    setIsSaving(true);
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) {
      setIsSaving(false);
      return;
    }

    const formData = new FormData(form);
    const newNotificationConfig: SpotifyNotificationConfig = {
      showId:                formData.get('show')?.toString() || '',
      notificationChannelId: formData.get('notification-channel')?.toString() || '',
      notificationRoleId:    formData.get('notification-role')?.toString(),
    };

    await spotify.postShow(newNotificationConfig);
    await spotify.updateShows();
    setSpotifyShow(null);
    setNotificationConfig(null);
    setIsSaving(false);
  }, [isSaving, spotify, setSpotifyShow, setNotificationConfig]);

  const onCancel = useCallback(() => {
    if (isSaving) {
      return;
    }

    setSpotifyShow(null);
    setNotificationConfig(null);
  }, [isSaving, setSpotifyShow, setNotificationConfig]);

  return <form className="spotify-show-form" onSubmit={onSubmitHandler}>
    <div className="spotify-show-form__items">
      <input name="show"type="text" value={notificationConfig?.showId} readOnly hidden />

      <div className="spotify-show-form__item">
        <label>Notification channel</label>
        <select name="notification-channel" defaultValue={notificationConfig?.notificationChannelId}>
          {guild.data?.channels
            ?.filter((channel) => 'TEXT' === channel.type || 'ANNOUNCEMENT' === channel.type)
             .map((channel) => <option key={channel.id} value={channel.id}>{channel.name}</option>)
          }
        </select>
      </div>

      <div className="spotify-show-form__item">
        <label>Notification role</label>
        <select name="notification-role" defaultValue={notificationConfig?.notificationRoleId ?? ''}>
          <option value="">None</option>
          {guild.data?.roles?.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
        </select>
      </div>
    </div>

    <div className="spotify-show-form__buttons">
      <button className={`spotify-show-form__button${isSaving ? ' spotify-show-form__button--loading' : ''}`} type="submit">Save</button>
      <button className={`spotify-show-form__button${isSaving ? ' spotify-show-form__button--loading' : ''}`} onClick={onCancel}>Cancel</button>
    </div>
  </form>;
}

