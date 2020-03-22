import { playerIds, pieceTypes } from '../game.model';
import pieceConfig from './pieceConfig';

const pieceNameToConstructorMap: { [key: string]: any } = {
  [pieceTypes.levy]: makeLevy,
  [pieceTypes.legion]: makeLegion,
  [pieceTypes.archer]: makeArcher,
  [pieceTypes.cataphract]: makeCataphract,
  [pieceTypes.chariot]: makeChariot,
  [pieceTypes.warElephant]: makeWarElephant,
  [pieceTypes.centaur]: makeCentaur,
  [pieceTypes.lightCavalry]: makeLightCavalry,
  [pieceTypes.general]: makeGeneral,
};

export interface IPiece {
  pieceType: pieceTypes;
  player: playerIds;
  isSelected: boolean;
  health: number;
  maxHealth: number;
  attack: number;
  moveRange: number;
  range: number | null;
  takeDamage: (damage: number) => void;
  getImageUrl: () => string;
}

class Piece implements IPiece {
  public player: playerIds;
  public isSelected: boolean = false;
  public imageUrl: string;
  public pieceType = pieceTypes.levy;
  public health;
  readonly maxHealth: number;
  attack;
  moveRange;
  range: number | null;

  constructor(player: playerIds, pieceType: pieceTypes, remainingHealth?: number) {
    const config = pieceConfig[pieceType];

    this.player = player;
    this.pieceType = pieceType;
    this.moveRange = config.speed;
    this.health = remainingHealth ?? config.health;
    this.maxHealth = config.health;
    this.attack = config.attack;
    this.imageUrl = player === playerIds.phrygians ? config.whiteSvgSource : config.svgSource;
    this.range = config.range;
  }

  public takeDamage(damage: number): number {
    this.health = this.health - damage;
    return this.health;
  }

  public getImageUrl(): string {
    return this.imageUrl;
  }
}

export function generatePiece(pieceType: pieceTypes, player: playerIds, remainingHealth?: number) {
  return new pieceNameToConstructorMap[pieceType](player, remainingHealth);
}

function makeLevy(player: playerIds, remainingHealth?: number) {
  return new Piece(player, pieceTypes.levy, remainingHealth);
}

function makeLegion(player: playerIds, remainingHealth?: number) {
  return new Piece(player, pieceTypes.legion, remainingHealth);
}

function makeArcher(player: playerIds, remainingHealth?: number) {
  return new Piece(player, pieceTypes.archer, remainingHealth);
}

function makeChariot(player: playerIds, remainingHealth?: number) {
  return new Piece(player, pieceTypes.chariot, remainingHealth);
}

function makeLightCavalry(player: playerIds, remainingHealth?: number) {
  return new Piece(player, pieceTypes.lightCavalry, remainingHealth);
}

function makeCataphract(player: playerIds, remainingHealth?: number) {
  return new Piece(player, pieceTypes.cataphract, remainingHealth);
}

function makeCentaur(player: playerIds, remainingHealth?: number) {
  return new Piece(player, pieceTypes.centaur, remainingHealth);
}

function makeWarElephant(player: playerIds, remainingHealth?: number) {
  return new Piece(player, pieceTypes.warElephant, remainingHealth);
}

function makeGeneral(player: playerIds, remainingHealth?: number) {
  return new Piece(player, pieceTypes.general, remainingHealth);
}
