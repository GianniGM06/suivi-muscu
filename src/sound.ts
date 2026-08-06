// Signal sonore de fin de chrono — WebAudio.
// iOS exige qu'un AudioContext soit créé/débloqué par un geste utilisateur :
// initSound() est appelé au premier toucher (voir App.tsx).
// Le son sort par la sortie active (casque Bluetooth inclus) tant que l'app
// est au premier plan. Écran verrouillé : iOS suspend tout, pas de son possible.

let ctx: AudioContext | null = null;

export function initSound(): void {
  if (ctx) return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    // Débloque le contexte avec un buffer silencieux (requis sur iOS)
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    ctx = null;
  }
}

export function jouerFinChrono(): void {
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") void ctx.resume();
    // Triple bip : 880 Hz, 120 ms, espacés de 200 ms
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      const t = ctx.currentTime + i * 0.2;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    }
  } catch {
    /* le flash visuel reste le signal principal */
  }
}
