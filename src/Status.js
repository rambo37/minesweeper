import { Timer } from "./Timer";

export function Status({ statusClass, status, seconds, setSeconds, paused }) {
  return (
    <div className={statusClass}>
      {status}
      <Timer seconds={seconds} setSeconds={setSeconds} paused={paused} />
    </div>
  );
}
