import { Color, Coords, FENChar, SafeSquare } from './models';
import { Bishop } from './pieces/bishop';
import { King } from './pieces/king';
import { Knight } from './pieces/knight';
import { Pawn } from './pieces/pawn';
import { Piece } from './pieces/piece';
import { Queen } from './pieces/queen';
import { Rook } from './pieces/rook';

export class ChessBoard {
  private chessBoard: (Piece | null)[][];
  private readonly ChessBoardSize: number = 8;
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

  private areCoordsValid(x: number, y: number): boolean {
    return (
      x >= 0 && x < this.ChessBoardSize && y >= 0 && y < this.ChessBoardSize
    );
  }

  public isInChek(playerColor: Color): boolean {
    for (let x = 0; x < this.ChessBoardSize; x++) {
      for (let y = 0; y < this.ChessBoardSize; y++) {
        const piece: Piece | null = this.chessBoard[x][y];
        if (!piece || piece.color === playerColor) {
          continue;
        }

        for (const { x: dx, y: dy } of piece.directions) {
          let newX: number = x + dx;
          let newY: number = y + dy;

          if (!this.areCoordsValid(newX, newY)) {
            continue;
          }

          if (
            piece instanceof Pawn ||
            piece instanceof King ||
            piece instanceof Knight
          ) {
            // paws are only attacing diagonally
            if (piece instanceof Pawn && dy === 0) {
              continue;
            }
            const attackedPiece: Piece | null = this.chessBoard[newX][newY];
            if (
              attackedPiece instanceof King &&
              attackedPiece.color !== playerColor
            ) {
              return false;
            }
          } else {
            while (this.areCoordsValid(newX, newY)) {
              const attackedPiece: Piece | null = this.chessBoard[newX][newY];
              if (
                attackedPiece instanceof King &&
                attackedPiece.color !== playerColor
              ) {
                return true;
              }
              if (attackedPiece !== null) {
                break;
              }
              newX += dx;
              newY += dy;
            }
          }
        }
      }
    }

    return false;
  }

  private isPositionSafeAfterMove(
    piece: Piece,
    prevX: number,
    prevY: number,
    newX: number,
    newY: number
  ): boolean {
    const newPiece: Piece | null = this.chessBoard[newX][newY];
    // we cant put piece on a square that already has a piece of the same square
    if (newPiece && newPiece.color === piece.color) {
      return false;
    }

    //simulate position
    this.chessBoard[prevX][prevY] = null;
    this.chessBoard[newX][newY] = piece;

    const isPostionSafe: boolean = !this.isInChek(piece.color);

    // restore position
    this.chessBoard[prevX][prevY] = piece;
    this.chessBoard[newX][newY] = newPiece;

    return isPostionSafe;
  }

  private findSafeSquares(): SafeSquare {
    const safeSquare: SafeSquare = new Map<string, Coords[]>();

    for (let x = 0; x < this.ChessBoardSize; x++) {
      for (let y = 0; y < this.ChessBoardSize; y++) {
        const piece: Piece | null = this.chessBoard[x][y];
        if (!piece || piece.color !== this.playerColor) {
          continue;
        }

        const pieceSafeSquares: Coords[] = [];

        for (const { x: dx, y: dy } of piece.directions) {
          let newX: number = x + dx;
          let newY: number = y + dy;

          if (!this.areCoordsValid(newX, newY)) {
            continue;
          }

          let newPiece: Piece | null = this.chessBoard[newX][newY];
          if (newPiece && newPiece.color === piece.color) {
            continue;
          }

          // need to restrict pawn moves in certain directions
          if (piece instanceof Pawn) {
            //cant move pawn two squares staright if there is piece infront of him
            if (dx === 2 || dx === -2) {
              if (newPiece) {
                continue;
              }
              if (this.chessBoard[newX + (dx === 2 ? 1 : -1)][newY]) {
                continue;
              }
            }
            // cant move pawn one square straight if piece is infront of him
            if (dx === 1 || (dx === -1 && dy === 0 && newPiece)) {
              continue;
            }

            // cant move pawn diagonally if there is no piece to attack
            if (
              (dy === 1 || dy === -1) &&
              (!newPiece || piece.color === newPiece.color)
            ) {
              continue;
            }
          }

          if (
            piece instanceof Pawn ||
            piece instanceof Knight ||
            piece instanceof King
          ) {
            if (this.isPositionSafeAfterMove(piece, x, y, newX, newY)) {
              pieceSafeSquares.push({ x: newX, y: newY });
            }
          } else {
            while (this.areCoordsValid(newX, newY)) {
              newPiece = this.chessBoard[newX][newY];
              if (newPiece && newPiece.color === piece.color) {
                break;
              }
              if (this.isPositionSafeAfterMove(piece, x, y, newX, newY)) {
                pieceSafeSquares.push({ x: newX, y: newY });
              }
              if (newPiece !== null) {
                break;
              }
              newX += dx;
              newY += dy;
            }
          }
        }
        if (pieceSafeSquares.length) {
          safeSquare.set(x + ',' + y, pieceSafeSquares);
        }
      }
    }

    return safeSquare;
  }
}
