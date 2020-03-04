import * as React from 'react';
import { pieceTypes, playerIds } from './game.model';
import { IFallenPiecesStruct } from './game';
import pieceConfig from './pieces/pieceConfig';

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
        {iconAndCount(pieceTypes.levy, playerIds.phrygians, whiteCounts)}
        {iconAndCount(pieceTypes.archer, playerIds.phrygians, whiteCounts)}
        {iconAndCount(pieceTypes.legion, playerIds.phrygians, whiteCounts)}
        {iconAndCount(pieceTypes.lightCavalry, playerIds.phrygians, whiteCounts)}
      </span>
      <span>
        {iconAndCount(pieceTypes.chariot, playerIds.phrygians, whiteCounts)}
        {iconAndCount(pieceTypes.centaur, playerIds.phrygians, whiteCounts)}
        {iconAndCount(pieceTypes.cataphract, playerIds.phrygians, whiteCounts)}
        {iconAndCount(pieceTypes.warElephant, playerIds.phrygians, whiteCounts)}
      </span>
      <span>
        {iconAndCount(pieceTypes.levy, playerIds.hittites, blackCounts)}
        {iconAndCount(pieceTypes.archer, playerIds.hittites, blackCounts)}
        {iconAndCount(pieceTypes.legion, playerIds.hittites, blackCounts)}
        {iconAndCount(pieceTypes.lightCavalry, playerIds.hittites, blackCounts)}
      </span>
      <span>
        {iconAndCount(pieceTypes.chariot, playerIds.hittites, blackCounts)}
        {iconAndCount(pieceTypes.centaur, playerIds.hittites, blackCounts)}
        {iconAndCount(pieceTypes.cataphract, playerIds.hittites, blackCounts)}
        {iconAndCount(pieceTypes.warElephant, playerIds.hittites, blackCounts)}
      </span>
    </span>
  );
}

function iconAndCount(pieceId: pieceTypes, playerId: playerIds, fallenCount: any) {
  const svg =
    playerId === playerIds.phrygians
      ? pieceConfig[pieceId].whiteSvgSource
      : pieceConfig[pieceId].svgSource;
  return (
    <div>
      <button
        className="cemetery-square"
        style={{
          backgroundImage: `url(${svg})` || '',
        }}
      >
        <span className="cemetery-fallen-count" style={{ color: 'maroon' }}>
          {fallenCount[pieceId]}
        </span>
      </button>
    </div>
  );
}
