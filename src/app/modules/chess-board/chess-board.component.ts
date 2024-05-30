import { Component } from '@angular/core';
import { ChessBoard } from '../../chess-logic/chess-board';
import { Color, FENChar, pieceImagePaths } from '../../chess-logic/models';

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

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoard.isSquareDark(x, y);
  }
}
