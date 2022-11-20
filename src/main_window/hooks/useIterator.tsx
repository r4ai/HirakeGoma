import { useState } from "react";
import { FC } from "react";

export const useIterator = (maxI: number = 0) => {
  const [i, setIndex] = useState(0);

  function prev(): void {
    if (i === 0) {
      setIndex(maxI);
    } else {
      setIndex(i - 1);
    }
  }

  function next(): void {
    if (i === maxI) {
      setIndex(0);
    } else {
      setIndex(i + 1);
    }
  }

  function set(i: number): void {
    setIndex(i);
  }

  function first(): void {
    setIndex(0);
  }

  function last(): void {
    setIndex(maxI);
  }

  function nextByX(x: number): void {
    // TODO
  }

  function prevByX(x: number): void {
    // TODO
  }

  return { i, prev, next, set, first, last, nextByX, prevByX };
};
