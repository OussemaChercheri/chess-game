import { Component } from '@angular/core';
import { ChessBoard } from '../../chess-logic/chess-board';
import {
  Color,
  Coords,
  FENChar,
  SafeSquare,
  pieceImagePaths,
} from '../../chess-logic/models';
import { SelectedSquare } from './models';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.css',
})
export class ChessBoardComponent {
  public pieceImagePaths = pieceImagePaths;

  private ChessBoard = new ChessBoard();
  public ChessBoardView: (FENChar | null)[][] = this.ChessBoard.ChessBoardView;
  public get playerColor(): Color {
    return this.ChessBoard.playerColor;
  }

  public get safeSquare(): SafeSquare {
    return this.ChessBoard.SafeSquare;
  }
  private selecetedSquare: SelectedSquare = { piece: null };
  private pieceSafeSquares: Coords[] = [];

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoard.isSquareDark(x, y);
  }

  public isSquareSelected(x: number, y: number): boolean {
    if (!this.selecetedSquare.piece) return false;
    return this.selecetedSquare.x === x && this.selecetedSquare.y === y;
  }

  public isSquareSafeForSelectedPiece(x: number, y: number): boolean {
    return this.pieceSafeSquares.some(
      (coords) => coords.x === x && coords.y === y
    );
  }

  public selectingPiece(x: number, y: number): void {
    const piece: FENChar | null = this.ChessBoardView[y][x];
    if (!piece) return;
    if (this.isWrongPieceSelected(piece)) return;

    this.selecetedSquare = { piece, x, y };
    this.pieceSafeSquares = this.safeSquare.get(x + ',' + y) || [];
  }

  private isWrongPieceSelected(piece: FENChar): boolean {
    const isWhitePieceSelceted = piece === piece.toUpperCase();
    return (
      (isWhitePieceSelceted && this.playerColor === Color.black) ||
      (!isWhitePieceSelceted && this.playerColor === Color.white)
    );
  }
}
