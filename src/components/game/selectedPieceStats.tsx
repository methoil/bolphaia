import * as React from 'react';
import pieceConfig from '../pieces/pieceConfig';
import { pieceTypes } from './game.model';
import { IPiece } from '../pieces/IPieces.model';

interface ISlectedPieceStatsProps {
  piece: any;
}

export default function SelectedPieceStats(props: ISlectedPieceStatsProps) {
  if (!props.piece) {
    return <span className={'selected-piece-stats'}>No piece selected</span>;
  }

  const config = pieceConfig[props.piece?.pieceType || ''];
  //   if (config) {
  return (
    <span className="selected-piece-stats">
      <div className="home-piece-description-title">
        <button
          className="square"
          style={{
            backgroundImage: `url(${config.svgSource})` || '',
          }}
        ></button>{' '}
        <span className="home-piece-description-title-text">&nbsp;&nbsp;{config.displayName}</span>
      </div>
      <div className="lore-text">{config.lore}</div>
    </span>
  );
  //   }
}
