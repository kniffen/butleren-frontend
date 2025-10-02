import type { JSX } from 'react';
import { useAPI } from '../../provider/hooks/useAPI';
import { Card } from '../Card/Card';
import { Toggle } from '../Toggle/Toggle';
import './Commands.scss';

export function Commands(): JSX.Element {
  const { modules, commands } = useAPI();

  return (
    <div className="commands">
      {commands.data.map(command =>
        <Card className="command-card" title={command.slug} key={command.slug}>
          <Toggle
            className="command-card__toggle"
            defaultChecked={command.isEnabled || command.isLocked}
            isLocked={command.isLocked}
            onChange={async (checked: boolean) => {
              await commands.updateSettings(command.slug, { isEnabled: checked });
              await Promise.all([
                commands.update(),
                modules.updateModules()
              ]);
            }}
          />
          <p className="command-card__description">{command.description}</p>
        </Card>
      )}
    </div>
  );
}