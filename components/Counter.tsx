"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

type CounterProps = {
  initialCount: number;
  onEnd: () => void;
};

export type CounterRef = {
  reinit: () => void;
};

const Counter = forwardRef(({ initialCount, onEnd }: CounterProps, ref) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count === 0) {
      onEnd();
      return;
    }

    const interval = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [count, onEnd]);

  useImperativeHandle(ref, () => ({
    reinit: () => {
      setCount(initialCount);
    },
  }));

  return <>{count}</>;
});

Counter.displayName = "Counter";
export default Counter;
