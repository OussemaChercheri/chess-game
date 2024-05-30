import { FENChar } from '../../chess-logic/models';

type SquarewithPiece = {
  piece: FENChar;
  x: number;
  y: number;
};

type SquarewithoutPiece = {
  piece: null;
};

export type SelectedSquare = SquarewithPiece | SquarewithoutPiece;
