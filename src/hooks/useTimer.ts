import { useEffect, useRef, useState } from "react";

export interface TimerState {
  label: string;
  mode: "repos" | "exo";
  totalSec: number;
  endsAt: number | null; // timestamp ms — base du calcul, fiable après retour d'arrière-plan
  pausedRemaining: number | null;
  finished: boolean;
}

export interface TimerApi {
  state: TimerState | null;
  remaining: number;
  start: (label: string, sec: number, mode?: "repos" | "exo") => void;
  addSec: (sec: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  dismiss: () => void;
}

export function useTimer(): TimerApi {
  const [state, setState] = useState<TimerState | null>(null);
  const [now, setNow] = useState(Date.now());
  const flashed = useRef(false);

  useEffect(() => {
    if (!state || state.finished || state.pausedRemaining !== null) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    // Recalage immédiat au retour au premier plan (iOS suspend les timers JS)
    const onVisible = () => setNow(Date.now());
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [state]);

  const remaining =
    state === null
      ? 0
      : state.pausedRemaining !== null
        ? state.pausedRemaining
        : state.endsAt === null
          ? 0
          : Math.max(0, Math.ceil((state.endsAt - now) / 1000));

  useEffect(() => {
    if (state && !state.finished && state.pausedRemaining === null && remaining <= 0 && state.endsAt) {
      setState({ ...state, finished: true });
      if (!flashed.current) {
        flashed.current = true;
        try {
          navigator.vibrate?.([200, 100, 200]);
        } catch {
          /* Safari iOS : pas de vibration — le signal visuel suffit */
        }
      }
    }
  }, [remaining, state]);

  return {
    state,
    remaining,
    start: (label, sec, mode = "repos") => {
      flashed.current = false;
      setState({ label, mode, totalSec: sec, endsAt: Date.now() + sec * 1000, pausedRemaining: null, finished: false });
    },
    addSec: (sec) =>
      setState((s) => {
        if (!s) return s;
        if (s.pausedRemaining !== null) return { ...s, pausedRemaining: s.pausedRemaining + sec, finished: false };
        return { ...s, endsAt: (s.endsAt ?? Date.now()) + sec * 1000, finished: false };
      }),
    pause: () =>
      setState((s) =>
        s && s.endsAt && s.pausedRemaining === null
          ? { ...s, pausedRemaining: Math.max(0, Math.ceil((s.endsAt - Date.now()) / 1000)), endsAt: null }
          : s
      ),
    resume: () =>
      setState((s) =>
        s && s.pausedRemaining !== null
          ? { ...s, endsAt: Date.now() + s.pausedRemaining * 1000, pausedRemaining: null }
          : s
      ),
    reset: () =>
      setState((s) => {
        if (!s) return s;
        flashed.current = false;
        return { ...s, endsAt: Date.now() + s.totalSec * 1000, pausedRemaining: null, finished: false };
      }),
    dismiss: () => setState(null)
  };
}
