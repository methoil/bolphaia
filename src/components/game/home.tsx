import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import pieceDefs from '../pieces/pieceConfig';

export default function Home() {
  return (
    <div>
      <div className="home-flex-wrapper">
        <div className="game-mode-button">
          <img src={require('../../resources/warRoom.jpg')} width="349" height="222"></img>
          <Link to="/offline-mode">
            <Button>Play offline on this screen</Button>
          </Link>
        </div>

        <div className="game-mode-button">
          <img src={require('../../resources/onlineBattle.jpg')} width="349" height="222"></img>
          <Link to="/online-mode">
            <Button>Enter lobby to play online</Button>
          </Link>
        </div>
      </div>
      <div className="home-flex-wrapper">
        {makePieceDescription(pieceDefs.levy)}
        {makePieceDescription(pieceDefs.archer)}
        {makePieceDescription(pieceDefs.legion)}
      </div>
      <div className="home-flex-wrapper">
        {makePieceDescription(pieceDefs.cataphract)}
        {makePieceDescription(pieceDefs.chariot)}
        {makePieceDescription(pieceDefs.lightCavalry)}
      </div>
      <div className="home-flex-wrapper">
        {makePieceDescription(pieceDefs.general)}
        {makePieceDescription(pieceDefs.centaur)}
        {makePieceDescription(pieceDefs.warElephant)}
      </div>
    </div>
  );
}

function makePieceDescription(pieceDef) {
  return pieceDescription(pieceDef.displayName, pieceDef.lore, pieceDef.svgSource);
}

function pieceDescription(displayName: string, lore: string, svgSource: string) {
  return (
    <div className="home-piece-description">
      <div>
        <button className="square"
          style={{
            backgroundImage: `url(${svgSource})` || '',
          }}
        ></button>{' '}
        <span className="home-piece-description">{displayName}</span>
      </div>
      <div className="lore-text">{lore}</div>
    </div>
  );
}
