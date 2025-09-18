import React, { useEffect } from "react";

export function Timer({paused, seconds, setSeconds}) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        setSeconds(seconds + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, seconds]);

  let text = `Time elapsed: ${seconds} `;
  text += seconds === 1 ? "second" : "seconds";

  return <div>{text}</div>;
}
