import React, { useEffect, useState } from "react";
import Board from "../board/Board";
import Keyboard from "../keyboard/Keyboard";
import {
  boardStateType,
  gameStateType,
  keyState,
  state
} from "../types/wordgic.types";
import WORD from "../words.json";
import { GAME_COLOR, GAME_STAGE } from "./game.constants";

const DICT_LEN = WORD.DICT.length;

export default function GameBox() {
  const timeForNewGame = () => {
    const savedState = JSON.parse(localStorage.getItem("wordgic") ?? "{}");
    const newDate = new Date().getDate();
    const oldDate = savedState.stage ? savedState.date : null;
    const dateChanged = newDate !== oldDate;
    if (oldDate === null) return true;
    return dateChanged;
  };
  const getGameWord = () => {
    const savedState = JSON.parse(localStorage.getItem("wordgic") ?? "{}");
    // const now = new Date().getTime();
    // const start = new Date(new Date().getFullYear(), 0, 0).getTime();
    // const diff: number = now - start;
    // const oneDay = 1000 * 60 * 60 * 24;
    // const day = Math.floor(diff / oneDay);
    return !timeForNewGame()
      ? savedState.gameWord
      : WORD.DICT[Math.floor(Math.random() * DICT_LEN)];
  };

  const getGameState = () => {
    const savedState = JSON.parse(localStorage.getItem("wordgic") ?? "{}");
    return !timeForNewGame() ? savedState : getInitState();
  };
  const getInitRows = () => {
    const cells = [];
    for (let index = 0; index < 7; index++) {
      const cellRow = [];
      for (let ind = 0; ind < 6; ind++) {
        cellRow.push({ val: "" });
      }
      cells.push(cellRow);
    }
    return cells;
  };

  const getInitState = () => {
    return {
      boardState: getInitRows(),
      currIndex: 0,
      keyBoardState: {},
      gameWord: getGameWord(),
      stage: GAME_STAGE.NOT_STARTED,
      date: new Date().getDate()
    };
  };

  const [gameState, setgameState] = useState<gameStateType>(getGameState());
  const [rowInd, setRowInd] = useState<number | undefined>();
  const [isGameWinner, setIsGameWinner] = useState(getGameState().result);
  const [errorText, setErrorText] = useState("");
  useEffect(() => {
    if (
      gameState.stage === GAME_STAGE.NOT_STARTED &&
      gameState.boardState[0][0].val !== ""
    ) {
      setgameState({
        ...getInitState(),
        ...gameState,
        stage: GAME_STAGE.IN_PROGRESS
      });
    }
    if (gameState.stage === GAME_STAGE.IN_PROGRESS) {
      localStorage.setItem("wordgic", JSON.stringify(gameState));
    }
  }, [gameState]);

  const handleAnswerCheck = (text: string[]) => {
    const matchingWord = text.toString().replaceAll(",", "");
    const isMatchingInDict = WORD.DICT.filter(
      (item: string) => item.localeCompare(matchingWord) === 0
    ).length;
    if (!isMatchingInDict) {
      setErrorText(`words doesn't exists`);
      return;
    }
    const gameStateTemp = { ...gameState };
    const word = gameStateTemp.gameWord.split("");
    const wordProbable = [];
    const boardState = gameStateTemp.boardState;
    const currIndex = gameStateTemp.currIndex;
    const posMap = Array(6).fill(false);
    for (let index = 0; index < 6; index++) {
      if (word[index] === text[index]) {
        boardState[currIndex][index].color = GAME_COLOR.RIGHT_POS;
        posMap[index] = true;
      } else {
        wordProbable.push(word[index]);
      }
    }
    for (let index = 0; index < 6; index++) {
      if (!posMap[index] && wordProbable.includes(text[index])) {
        wordProbable[index] = "0";
        boardState[currIndex][index].color = GAME_COLOR.PROBABLE_POS;
      }
    }
    const isWinner =
      posMap.filter((item: boolean) => item === true).length === 6;
    setTimeout(
      () =>
        changeGameState(
          { ...gameState, boardState, currIndex: currIndex + 1 },
          isWinner
        ),
      2000
    );
  };

  const changeGameState = (state: gameStateType, isWinner: boolean) => {
    setRowInd(state.currIndex - 1);
    if (isWinner) {
      setIsGameWinner(true);
      if (state.currIndex < 7) setgameState({ ...state, result: true });
      else setgameState({ ...state, currIndex: 6, result: true });
    } else {
      if (state.currIndex < 7) setgameState(state);
      else {
        setIsGameWinner(false);
        setgameState({ ...state, currIndex: 6, result: false });
      }
    }
  };

  const isRowFill = () => {
    const savedState = { ...gameState };
    const isRowDone =
      savedState.boardState[savedState.currIndex].filter(
        (item: state) => item.val !== ""
      ).length === 6;
    return isRowDone;
  };

  const handleEnter = () => {
    const savedState = { ...gameState };
    const isRowDone =
      savedState.boardState[savedState.currIndex].filter(
        (item: state) => item.val !== ""
      ).length === 6;
    if (isRowDone) {
      handleAnswerCheck([
        ...savedState.boardState[savedState.currIndex].map(
          (item: state) => item.val
        )
      ]);
    }
  };

  const handleDel = () => {
    setErrorText("");
    const savedState = { ...gameState };
    const delFrom =
      savedState.boardState[savedState.currIndex].filter(
        (item: state) => item.val !== ""
      ).length - 1;
    if (delFrom >= 0)
      savedState.boardState[savedState.currIndex][delFrom] = {
        val: "",
        color: undefined
      };
    setgameState(savedState);
  };

  const handleKeyBoardClick = (val: string) => {
    if (val === "Enter") {
      handleEnter();
      return;
    } else if (val === "Del") {
      handleDel();
      return;
    }
    if (isRowFill()) return;
    const boardState = [...gameState.boardState];
    let flag = true;
    for (const row of boardState) {
      if (!flag) break;
      for (const value of row) {
        if (value.val === "") {
          value.val = val;
          flag = false;
          break;
        }
      }
    }
    setgameState({ ...gameState, boardState });
  };

  const ResultJSX = () => (
    <>
      {" "}
      {isGameWinner && <h3 style={{ textAlign: "center" }}>Awesome 🚀🎉😚</h3>}
      {isGameWinner === false && (
        <h3 style={{ textAlign: "center" }}>Better luck next time 😬😢</h3>
      )}
      {gameState.result === true || gameState.result === false ? (
        <h4
          style={{
            textAlign: "center",
            margin: "20px 25px",
            border: "1px solid",
            padding: "5px",
            color: "black",
            background: "#dfdfcf",
            borderRadius: "20px"
          }}
        >
          {gameState.gameWord}
        </h4>
      ) : (
        ""
      )}
      {(gameState.result === true || gameState.result === false) && (
        <p style={{ textAlign: "center" }}>
          Next game is available at 00:00 AM (IST)
        </p>
      )}
    </>
  );
  return (
    <div>
      {ResultJSX()}
      <h6 style={{ textAlign: "center" }}> {errorText}</h6>
      <Board wordle={gameState.boardState} rowInd={rowInd} />
      <Keyboard
        keys={gameState.keyBoardState}
        handleKeyBoardClick={handleKeyBoardClick}
      />
      <p style={{ textAlign: "center", fontSize: "12px" }}>© Copyright @AR22</p>
    </div>
  );
}
