import { Color, FENChar } from './models';
import { Bishop } from './pieces/bishop';
import { King } from './pieces/king';
import { Knight } from './pieces/knight';
import { Pawn } from './pieces/pawn';
import { Piece } from './pieces/piece';
import { Queen } from './pieces/queen';
import { Rook } from './pieces/rook';

export class ChessBoard {
  private chessBoard: (Piece | null)[][];
  private _playerColor = Color.white;

  constructor() {
    this.chessBoard = [
      [
        new Rook(Color.white),
        new Knight(Color.white),
        new Bishop(Color.white),
        new Queen(Color.white),
        new King(Color.white),
        new Bishop(Color.white),
        new Knight(Color.white),
        new Rook(Color.white),
      ],
      [
        new Pawn(Color.white),
        new Pawn(Color.white),
        new Pawn(Color.white),
        new Pawn(Color.white),
        new Pawn(Color.white),
        new Pawn(Color.white),
        new Pawn(Color.white),
        new Pawn(Color.white),
      ],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [
        new Pawn(Color.black),
        new Pawn(Color.black),
        new Pawn(Color.black),
        new Pawn(Color.black),
        new Pawn(Color.black),
        new Pawn(Color.black),
        new Pawn(Color.black),
        new Pawn(Color.black),
      ],
      [
        new Rook(Color.black),
        new Knight(Color.black),
        new Bishop(Color.black),
        new Queen(Color.black),
        new King(Color.black),
        new Bishop(Color.black),
        new Knight(Color.black),
        new Rook(Color.black),
      ],
    ];
  }

  public get playerColor(): Color {
    return this._playerColor;
  }

  public get ChessBoardView(): (FENChar | null)[][] {
    return this.chessBoard.map((row) => {
      return row.map((piece) =>
        piece instanceof Piece ? piece.FENChar : null
      );
    });
  }

  public static isSquareDark(x: number, y: number): boolean {
    return (x % 2 === 0 && y % 2 === 0) || (x % 2 === 1 && y % 2 === 1);
  }
}
