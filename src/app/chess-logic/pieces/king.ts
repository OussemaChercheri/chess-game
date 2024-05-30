import { Color, Coords, FENChar } from '../models';
import { Piece } from './piece';

export class King extends Piece {
  private HasMoved: boolean = false;
  protected override _FENChar: FENChar;
  protected override _directions: Coords[] = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
  ];

  constructor(private pieceColor: Color) {
    super(pieceColor);
    this._FENChar =
      pieceColor === Color.white ? FENChar.WhiteKing : FENChar.BlackKing;
  }

  public get hasMoved(): boolean {
    return this.HasMoved;
  }

  public set hasMoved(_) {
    this.HasMoved = true;
  }
}
