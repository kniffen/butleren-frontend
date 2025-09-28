import { useCallback, useRef, type ReactNode } from 'react';
import { Card } from '../Card/Card';
import { useAPI } from '../../provider/hooks/useAPI';
import type { GuildSettings } from '../../types';
import'./GuildSettings.scss';

export function GuildSettings(): ReactNode {
  const { updateGuilds, guild } = useAPI();
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  const onChangeHandler = useCallback((e: React.FormEvent<HTMLElement>) => {
    if (throttleTimeout.current) {return;}
    if (!guild) {return;}
    if (!(e.target instanceof HTMLInputElement)) {return;}

    const form = e.target.parentElement;
    if (!(form instanceof HTMLFormElement)) {return;}

    throttleTimeout.current = setTimeout(async () => {
      const formData = new FormData(form);
      const settings: GuildSettings = {
        color:    formData.get('color')?.toString() || '#19D8B4',
        nickname: formData.get('nickname')?.toString(),
      };

      await guild.updateSettings(settings);
      await updateGuilds();

      throttleTimeout.current = null;
    }, 1000);
  }, [guild, updateGuilds]);

  if (!guild.data) {
    return null;
  }

  return (
    <Card title="Settings">
      <form className="guild-settings-form" onChange={onChangeHandler}>
        <div className="guild-settings-form__item">
          <label htmlFor="nickname">Nickname</label>
          <input type="text" id="nickname" name="nickname" defaultValue={guild.data.settings?.nickname || ''} />
        </div>
        <div className="guild-settings-form__item">
          <label htmlFor="color">Accent color</label>
          <input type="color" id="color" name="color" defaultValue={guild.data.settings?.color || '#000000'} />
        </div>
      </form>
    </Card>
  );
}