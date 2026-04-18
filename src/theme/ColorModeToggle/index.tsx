import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import type {Props} from '@theme/ColorModeToggle';

import styles from './styles.module.css';

export default function ColorModeToggle({
  className,
  buttonClassName,
  value,
  onChange,
}: Props): ReactNode {
  const isDark = value === 'dark';

  const dayBgUrl = useBaseUrl('/img/sky-day-bg.svg');
  const nightBgUrl = useBaseUrl('/img/sky-night-bg.svg');
  const moonUrl = useBaseUrl('/img/moon.svg');
  const sunUrl = useBaseUrl('/img/sun.svg');

  const toggle = () => {
    onChange(isDark ? 'light' : 'dark');
  };

  const label = translate(
    {
      message: 'Switch between dark and light mode (currently {mode})',
      id: 'theme.colorToggle.ariaLabel',
      description: 'The ARIA label for the navbar color mode toggle',
    },
    {
      mode:
        value === 'dark'
          ? translate({
              message: 'dark mode',
              id: 'theme.colorToggle.ariaLabel.mode.dark',
              description: 'The name for the dark color mode',
            })
          : translate({
              message: 'light mode',
              id: 'theme.colorToggle.ariaLabel.mode.light',
              description: 'The name for the light color mode',
            }),
    },
  );

  return (
    <div className={clsx(styles.toggle, className)}>
      <button
        className={clsx(styles.button, isDark && styles.isDark, buttonClassName)}
        type="button"
        onClick={toggle}
        aria-label={label}
        title={label}>
        {/* Fundos sobrepostos (crossfade) */}
        <img
          src={dayBgUrl}
          alt=""
          aria-hidden="true"
          className={clsx(styles.bg, styles.bgDay)}
        />
        <img
          src={nightBgUrl}
          alt=""
          aria-hidden="true"
          className={clsx(styles.bg, styles.bgNight)}
        />

        {/* Astro que desliza e gira — lua e sol sobrepostos fazem crossfade */}
        <div className={styles.astro}>
          <img
            src={moonUrl}
            alt=""
            aria-hidden="true"
            className={clsx(styles.orb, styles.orbMoon)}
          />
          <img
            src={sunUrl}
            alt=""
            aria-hidden="true"
            className={clsx(styles.orb, styles.orbSun)}
          />
        </div>
      </button>
    </div>
  );
}
