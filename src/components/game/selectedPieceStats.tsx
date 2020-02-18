import * as React from 'react';
import pieceConfig from '../pieces/pieceConfig';
import { IPiece, IRangedPiece } from '../pieces/IPieces.model';

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
      {(props.piece as IRangedPiece)?.range ? <div>Range: {props.piece.attack}</div> : ''}
      <div>Max Health: {props.piece.maxHealth}</div>
      <div>Reaming Health: {props.piece.health}</div>
      <div className="lore-text">{config.lore}</div>
    </span>
  );
}
