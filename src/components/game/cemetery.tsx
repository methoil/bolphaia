import * as React from 'react';
import { pieceTypes, playerIds } from './game.model';
import { IFallenPiecesStruct } from './game';
import pieceConfig from '../pieces/pieceConfig';

interface ISlectedPieceStatsProps {
  fallenPieces: IFallenPiecesStruct;
}

export default function Cemetery(props: ISlectedPieceStatsProps) {
  const whiteCounts = props.fallenPieces.phrygians;
  const blackCounts = props.fallenPieces.hittites;
  return (
    <span className="cemetery-container">
      <h4>New Arrivals to Hades</h4>
      <span>
        {iconAndCount(pieceTypes.levy, whiteCounts)}
        {iconAndCount(pieceTypes.archer, whiteCounts)}
        {iconAndCount(pieceTypes.legion, whiteCounts)}
        {iconAndCount(pieceTypes.lightCavalry, whiteCounts)}
      </span>
      <span>
        {iconAndCount(pieceTypes.chariot, whiteCounts)}
        {iconAndCount(pieceTypes.centaur, whiteCounts)}
        {iconAndCount(pieceTypes.cataphract, whiteCounts)}
        {iconAndCount(pieceTypes.warElephant, whiteCounts)}
      </span>
      <span>
        {iconAndCount(pieceTypes.levy, blackCounts)}
        {iconAndCount(pieceTypes.archer, blackCounts)}
        {iconAndCount(pieceTypes.legion, blackCounts)}
        {iconAndCount(pieceTypes.lightCavalry, blackCounts)}
      </span>
      <span>
        {iconAndCount(pieceTypes.chariot, blackCounts)}
        {iconAndCount(pieceTypes.centaur, blackCounts)}
        {iconAndCount(pieceTypes.cataphract, blackCounts)}
        {iconAndCount(pieceTypes.warElephant, blackCounts)}
      </span>
    </span>
  );
}

function iconAndCount(pieceId: pieceTypes, fallenCount: any) {
  return (
    <div>
      <button
        className="cemetery-square"
        style={{
          backgroundImage: `url(${pieceConfig[pieceId].svgSource})` || '',
        }}
      >
        <span style={{ color: 'maroon' }}>{fallenCount[pieceId]}</span>
      </button>
    </div>
  );
}
