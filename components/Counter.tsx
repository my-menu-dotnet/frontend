"use client";

import { useEffect, useState } from "react";

type CounterProps = {
  initialCount: number;
  onEnd: () => void;
};

export default function Counter({ initialCount, onEnd }: CounterProps) {
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

  return <>{count}</>;
}
