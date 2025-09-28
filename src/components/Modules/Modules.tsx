import type { JSX } from 'react';
import { useAPI } from '../../provider/hooks/useAPI';
import { Card } from '../../components/Card/Card';
import styles from './Modules.module.scss';
import { Toggle } from '../../components/Toggle/Toggle';

export function Modules(): JSX.Element {
  const { modules } = useAPI();

  return (
    <div className={styles.modules}>
      {modules.data.map(mod =>
        <Card className={styles.module} title={mod.name}>
          <Toggle
            className={styles.toggle}
            defaultChecked={mod.settings.isEnabled || mod.isLocked}
            isLocked={mod.isLocked}
            onChange={async (checked) => {
              await modules.updateModuleSettings(mod.slug, { isEnabled: checked });
              await modules.updateModules();
            }}
          />
          <p>{mod.description}</p>
        </Card>
      )}
    </div>
  );
}