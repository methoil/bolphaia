import * as React from 'react';
import pieceConfig from './pieces/pieceConfig';
import { IPiece } from './pieces/piece';

interface ISlectedPieceStatsProps {
  piece: IPiece | null;
}

export default function SelectedPieceStats(props: ISlectedPieceStatsProps) {
  if (!props.piece) {
    return <span className={'selected-piece-stats'}>No piece selected</span>;
  }

  const config = pieceConfig[props.piece?.pieceType || ''];
  return (
    <span className="selected-piece-stats">
      <div className="home-piece-description-title">
        <button
          className="square"
          style={{
            backgroundImage: `url(${props.piece.getImageUrl()})` || '',
          }}
        ></button>
        <span className="home-piece-description-title-text">&nbsp;&nbsp;{config.displayName}</span>
      </div>
      <div>Speed: {props.piece.moveRange}</div>
      <div>Attack: {props.piece.attack}</div>
      {(props.piece)?.range ? (
        <div>Range: {(props.piece).range}</div>
      ) : (
        ''
      )}
      <div>Max Health: {props.piece.maxHealth}</div>
      <div>Remaing Health: {props.piece.health}</div>
      <div className="lore-text">{config.lore}</div>
    </span>
  );
}
