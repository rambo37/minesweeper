import React, { useEffect } from "react";

export function Timer(props) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (!props.paused) {
        props.setSeconds(props.seconds + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [props]);

  let text = `Time elapsed: ${props.seconds} `;
  text += props.seconds === 1 ? "second" : "seconds";

  return <div>{text}</div>;
}
