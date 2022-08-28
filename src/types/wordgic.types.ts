export type state = {
  val: string;
  color?: string;
};
export type boardStateType = Array<state[]>;
export type keyState = { [key: string]: string };

export type gameStateType = {
  boardState: boardStateType;
  keyBoardState: keyState;
  currIndex: number;
  gameWord: string;
  stage: string;
  result?: boolean;
  date: number;
};
