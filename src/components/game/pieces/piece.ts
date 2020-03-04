import { playerIds, pieceTypes } from '../game.model';
import pieceConfig from './pieceConfig';

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

 export default class BasePiece implements IPiece {
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
  };
}

export function makeLevy(player: playerIds, remainingHealth?: number) {
  return new BasePiece(player, pieceTypes.levy, remainingHealth);
}

export function makeLegion(player: playerIds, remainingHealth?: number) {
  return new BasePiece(player, pieceTypes.legion, remainingHealth);
}

export function makeArcher(player: playerIds, remainingHealth?: number) {
  return new BasePiece(player, pieceTypes.archer, remainingHealth);
}

export function makeChariot(player: playerIds, remainingHealth?: number) {
  return new BasePiece(player, pieceTypes.chariot, remainingHealth);
}

export function makeLightCavalry(player: playerIds, remainingHealth?: number) {
  return new BasePiece(player, pieceTypes.lightCavalry, remainingHealth);
}

export function makeCataphract(player: playerIds, remainingHealth?: number) {
  return new BasePiece(player, pieceTypes.cataphract, remainingHealth);
}

export function makeCentaur(player: playerIds, remainingHealth?: number) {
  return new BasePiece(player, pieceTypes.centaur, remainingHealth);
}

export function makeWarElephant(player: playerIds, remainingHealth?: number) {
  return new BasePiece(player, pieceTypes.warElephant, remainingHealth);
}

export function makeGeneral(player: playerIds, remainingHealth?: number) {
  return new BasePiece(player, pieceTypes.general, remainingHealth);
}