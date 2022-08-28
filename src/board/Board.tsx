import React from "react";
import { boardStateType } from "../types/wordgic.types";

const WIDTH = "50px";

const getCellStyle = (color: string) => {
  const style: React.CSSProperties = {
    height: WIDTH,
    width: WIDTH,
    border: "1px solid black",
    margin: "3px",
    fontSize: "30px",
    paddingTop: "6px",
    boxSizing: "border-box",
    textAlign: "center",
    backgroundColor: color ?? "rgb(32 32 33)"
  };
  return style;
};

export default function Board({
  wordle,
  rowInd
}: {
  wordle: boardStateType;
  rowInd?: number;
}) {
  const grid = wordle ?? [];
  return (
    <div>
      {grid.map((val: any, index: number) => (
        <div style={{ display: "flex", justifyContent: "center" }} key={index}>
          {val?.map((v: any, ind: number) => (
            <div
              key={ind}
              style={getCellStyle(v.color)}
              className={rowInd === index ? "cell" : ""}
            >
              {v.val}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
