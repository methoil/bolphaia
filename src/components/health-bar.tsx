import * as React from "react";

export default function HealthBar(props: any) {
  return (
    <span className={"health-box"}>
      <span
        class-name={"remaining-health"}
        style={{ height: getHealthHeight(props.maxHealth, props.remainingHealth) }}
      ></span>
    </span>
  );
}

function getHealthHeight(max: number, remaining: number): string {
  const maxHealthPx = 6;
  const remainingHeight = (remaining / max) * maxHealthPx;
  return `${remainingHeight}px`;
}
