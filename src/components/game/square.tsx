import React, { useState } from 'react';
import HealthBar from './health-bar';
import { IPiece } from './pieces/piece';

interface ISquareProps {
  cssClasses: string[];
  piece: IPiece | null;
  onMoveClick: () => any;
  getHoverIcon: () => any;
}

export default function Square(props: ISquareProps) {
  const [hoverIcon, setHoverIcon] = useState('');

  return (
    <button
      className={`square ${props.cssClasses.join(' ')} ${hoverIcon}`}
      onClick={onClick}
      onMouseEnter={setHoverIconFromGameCallback}
      onMouseLeave={resetHoverIcon}
      style={{
        backgroundImage: `url(${props?.piece?.getImageUrl()})` || '',
      }}
    >
      {props.piece ? (
        <HealthBar
          maxHealth={props.piece.maxHealth}
          remainingHealth={props.piece.health}
        ></HealthBar>
      ) : (
        ''
      )}
    </button>
  );

  function onClick(): void {
    props.onMoveClick();
    return setHoverIconFromGameCallback();
  }

  function resetHoverIcon(): void {
    return setHoverIcon('');
  }

  function setHoverIconFromGameCallback(): void {
    return setHoverIcon(props.getHoverIcon());
  }
}
