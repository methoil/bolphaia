import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import pieceDefs from './pieces/pieceConfig';

export default function Home() {
  return (
    <div>
      <div className="home-flex-wrapper">
        <div className="main-title-intro">
          <h3>Bolphaia</h3>
          <div>
            Bolphaia is a board game inspired by chess with additional mechanics. Each player makes
            one move per turn, and the aim is to capture the oponent's general. An overview of the
            pieces can be seen below, and more detailed stats will be shown within the game.
          </div>
          <br></br>
          <div>
            You may reach me at mateev.br@gmail.com if you have any questions or comments about the
            game.
          </div>
        </div>
        <div className="game-mode-button">
          <img src={require('../../resources/warRoom.jpg')} width="349" height="222"></img>
          <Link to="/offline-mode">
            <Button>Play offline on one screen</Button>
          </Link>
        </div>

        <div className="game-mode-button">
          <img src={require('../../resources/onlineBattle.jpg')} width="349" height="222"></img>
          <Link to="/online-mode">
            <Button>Enter lobby to play online</Button>
          </Link>
        </div>
      </div>
      <div></div>
      <div className="home-flex-wrapper">
        <div className="home-piece-title-bar">
          <h3>Piece Lore:</h3>
        </div>
        <div className="home-piece-title-bar"></div>
        <div className="home-piece-title-bar"></div>
      </div>
      <div className="home-flex-wrapper">
        {makePieceDescription(pieceDefs.general)}
        {makePieceDescription(pieceDefs.levy)}
        {makePieceDescription(pieceDefs.legion)}
      </div>
      <div className="home-flex-wrapper">
        {makePieceDescription(pieceDefs.archer)}
        {makePieceDescription(pieceDefs.lightCavalry)}
        {makePieceDescription(pieceDefs.chariot)}
      </div>
      <div className="home-flex-wrapper">
        {makePieceDescription(pieceDefs.cataphract)}
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
      <div className="home-piece-description-title">
        <button
          className="square"
          style={{
            backgroundImage: `url(${svgSource})` || '',
          }}
        ></button>{' '}
        <span className="home-piece-description-title-text">&nbsp;&nbsp;{displayName}</span>
      </div>
      <div className="lore-text">{lore}</div>
    </div>
  );
}
