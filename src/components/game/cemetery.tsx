import * as React from 'react';
import { IPiece, IRangedPiece } from '../pieces/IPieces.model';
import { pieceTypes } from './game.model';
import { IFallenPiecesStruct } from './game';
import pieceConfig from '../pieces/pieceConfig';

interface ISlectedPieceStatsProps {
 fallenPieces: IFallenPiecesStruct;
}

export default function Cemetery(props: ISlectedPieceStatsProps) {
  const whiteCounts = props.fallenPieces.phrygians;
  const blackCounts = props.fallenPieces.hittites;
  return (
    <div className="cemetery-container">
      <span>
        <span>you</span>
        <span>you</span>
        <span>you</span>
        <span>you</span>
      </span>
      <span>
        <span>you</span>
        <span>you</span>
        <span>you</span>
        <span>you</span>
      </span>
      <span>
        <span>you</span>
        <span>you</span>
        <span>you</span>
        <span>you</span>
      </span>
      <span>
        <span>you</span>
        <span>you</span>
        <span>you</span>
        <span>you</span>
      </span>
    </div>
  );
}
