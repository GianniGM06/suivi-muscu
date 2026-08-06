import { useEffect, useRef } from "react";
import type { TimerApi } from "../hooks/useTimer";
import { jouerFinChrono } from "../sound";

export function TimerBar({ timer, son }: { timer: TimerApi; son: boolean }) {
  const dejaSonne = useRef<string | null>(null);
  const finished = timer.state?.finished ?? false;
  const label = timer.state?.label ?? "";

  useEffect(() => {
    if (finished && son && dejaSonne.current !== label) {
      dejaSonne.current = label;
      jouerFinChrono();
    }
    if (!finished) dejaSonne.current = null;
  }, [finished, son, label]);

  if (!timer.state) return null;
  const { state, remaining } = timer;
  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;

  if (state.finished) {
    return (
      <div className="timer-flash" onClick={timer.dismiss} role="alert">
        <div className="timer-flash-inner">
          <div className="timer-flash-title">⏱ Terminé</div>
          <div className="timer-flash-label">{state.label}</div>
          <button className="btn btn-primary btn-lg">OK</button>
        </div>
      </div>
    );
  }

  return (
    <div className="timer-bar">
      <div className="timer-info">
        <span className="timer-label">{state.label}</span>
        <span className="timer-time">
          {min}:{sec.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="timer-actions">
        <button className="btn btn-sm" onClick={() => timer.addSec(15)}>+15 s</button>
        <button className="btn btn-sm" onClick={() => timer.addSec(30)}>+30 s</button>
        {state.pausedRemaining !== null ? (
          <button className="btn btn-sm" onClick={timer.resume}>▶</button>
        ) : (
          <button className="btn btn-sm" onClick={timer.pause}>⏸</button>
        )}
        <button className="btn btn-sm" onClick={timer.reset}>↺</button>
        <button className="btn btn-sm btn-ghost" onClick={timer.dismiss}>✕</button>
      </div>
    </div>
  );
}
