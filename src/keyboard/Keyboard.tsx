import React from "react";
import { KEYS } from "../gameBox/keyboard.constants";
import { keyState } from "../types/wordgic.types";

const WIDTH = "45px";

const CELL_STYLE: React.CSSProperties = {
  height: WIDTH,
  border: "1px solid black",
  margin: "2px",
  fontSize: "18px",
  padding: "11px 9px",
  boxSizing: "border-box",
  textAlign: "center",
  cursor: "pointer"
};

export default function Keyboard({
  keys,
  handleKeyBoardClick
}: {
  keys: keyState;
  handleKeyBoardClick: (val: any) => void;
}) {
  return (
    <div style={{ marginTop: "20px" }}>
      {KEYS.map((row: any, index: number) => (
        <div style={{ display: "flex", justifyContent: "center" }} key={index}>
          {Object.keys(row).map((val: string, ind: number) => (
            <button
              style={CELL_STYLE}
              key={ind}
              className="button"
              onClick={() => handleKeyBoardClick(row[val])}
            >
              {row[val]}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
