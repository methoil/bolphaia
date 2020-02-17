import * as React from 'react';

interface IHealthBarProps {
  maxHealth: number;
  remainingHealth: number;
}

export default function HealthBar(props: IHealthBarProps) {
  return (
    <span className={'health-box'}>
      <span
        className={'remaining-health'}
        style={{ height: getHealthHeight(props.maxHealth, props.remainingHealth) }}
      ></span>
    </span>
  );
}

function getHealthHeight(max: number, remaining: number): string {
  const maxHealthPx = 29;
  const remainingHeight = (remaining / max) * maxHealthPx;
  return `${remainingHeight}px`;
}
