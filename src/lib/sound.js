// Web Audio API-гаар үүсгэсэн жижиг дуунууд (гадны дууны файл хэрэггүй)
let ctx = null;

export const sound = {
  on: false,

  toggle() {
    this.on = !this.on;
    if (this.on && !ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.on) this.startup();
    return this.on;
  },

  // freq давтамжтай богино дуу
  beep(freq = 660, dur = 0.08, type = "square", vol = 0.03) {
    if (!this.on || !ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  },

  open() { this.beep(880, 0.06); },
  close() { this.beep(440, 0.06); },
  // Компьютер асах үеийн аккорд
  startup() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.beep(f, 0.5, "sine", 0.06), i * 110));
  },
};
