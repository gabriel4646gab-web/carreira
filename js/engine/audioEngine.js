// Motor de Áudio Profissional com Web Audio API e Síntese Acústica Realista de Futebol
// Sons completos para dentro e fora das partidas, livre de direitos autorais protegidos e 100% offline.

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterVolume = 0.8;
    this.sfxVolume = 0.85;
    this.crowdVolume = 0.4;
    this.eventsVolume = 0.8;
    this.isMuted = false;

    // Nós de áudio para ambiente de estádio contínuo
    this.crowdGainNode = null;
    this.crowdSourceNodes = [];
    this.isAmbiencePlaying = false;

    this.loadSettings();
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('simulador_audio_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.masterVolume = parsed.masterVolume ?? 0.8;
        this.sfxVolume = parsed.sfxVolume ?? 0.85;
        this.crowdVolume = parsed.crowdVolume ?? 0.4;
        this.eventsVolume = parsed.eventsVolume ?? 0.8;
        this.isMuted = parsed.isMuted ?? false;
      }
    } catch (e) {}
  }

  saveSettings() {
    try {
      localStorage.setItem('simulador_audio_settings', JSON.stringify({
        masterVolume: this.masterVolume,
        sfxVolume: this.sfxVolume,
        crowdVolume: this.crowdVolume,
        eventsVolume: this.eventsVolume,
        isMuted: this.isMuted
      }));
    } catch (e) {}
  }

  getEffectiveVolume(type = 'sfx') {
    if (this.isMuted) return 0;
    if (type === 'crowd') return this.masterVolume * this.crowdVolume;
    if (type === 'event') return this.masterVolume * this.eventsVolume;
    return this.masterVolume * this.sfxVolume;
  }

  // ==========================================
  // 1. SONS DE PARTIDA (IN-MATCH)
  // ==========================================

  playWhistle(type = 'short') {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('sfx');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const createSingleBeep = (startTime, duration, isLong = false) => {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const bandpass = this.ctx.createBiquadFilter();

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(32, startTime);
      lfoGain.gain.setValueAtTime(140, startTime);
      lfo.connect(osc1.frequency);
      lfo.connect(osc2.frequency);

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(2850, startTime);
      osc2.frequency.setValueAtTime(3120, startTime);

      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(3000, startTime);
      bandpass.Q.setValueAtTime(3.5, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol * 0.45, startTime + 0.02);
      gain.gain.setValueAtTime(vol * 0.45, startTime + duration - 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc1.connect(bandpass);
      osc2.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.ctx.destination);

      lfo.start(startTime);
      osc1.start(startTime);
      osc2.start(startTime);
      lfo.stop(startTime + duration);
      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
    };

    if (type === 'kickoff') {
      createSingleBeep(now, 0.22);
      createSingleBeep(now + 0.28, 0.45, true);
    } else if (type === 'foul') {
      createSingleBeep(now, 0.14);
      createSingleBeep(now + 0.18, 0.14);
      createSingleBeep(now + 0.36, 0.35);
    } else if (type === 'fulltime') {
      createSingleBeep(now, 0.25);
      createSingleBeep(now + 0.35, 0.25);
      createSingleBeep(now + 0.70, 0.75, true);
    } else {
      createSingleBeep(now, 0.32);
    }
  }

  playKick(intensity = 'strong') {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('sfx');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = intensity === 'strong' ? 160 : 120;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

    oscGain.gain.setValueAtTime(vol * 0.8, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);

    // Ruído de contato
    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.015));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1400, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(vol * 0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);
  }

  playPass() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('sfx');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

    gain.gain.setValueAtTime(vol * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playNet() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('sfx');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.28;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / this.ctx.sampleRate;
      data[i] = (Math.random() * 2 - 1) * Math.sin(t * 80) * Math.exp(-t * 9);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(2.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.75, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playPostHit() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('sfx');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    [480, 960, 1420].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(vol * (0.6 / (idx + 1)), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    });
    this.playKick('strong');
  }

  playSave() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('sfx');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);

    gain.gain.setValueAtTime(vol * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  playTackle() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('sfx');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.05));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playCheer() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('crowd');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const duration = 2.4;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.ctx.sampleRate;
        const env = Math.min(1.0, t * 4) * Math.exp(-t * 0.85);
        data[i] = (Math.random() * 2 - 1) * env * 0.8;
      }
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, now);
    filter.frequency.linearRampToValueAtTime(950, now + 0.5);
    filter.Q.setValueAtTime(1.4, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 1.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playGasp() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('crowd');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const duration = 1.2;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.ctx.sampleRate;
        const env = Math.sin((t / duration) * Math.PI) * Math.exp(-t * 1.2);
        data[i] = (Math.random() * 2 - 1) * env;
      }
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.linearRampToValueAtTime(320, now + 0.7);
    filter.Q.setValueAtTime(2.2, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playBoo() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('crowd');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const duration = 1.8;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.ctx.sampleRate;
        data[i] = (Math.random() * 2 - 1) * Math.sin(t * 12) * Math.exp(-t * 0.5);
      }
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.85, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playInjury() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('sfx');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.35);

    gain.gain.setValueAtTime(vol * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
    this.playGasp();
  }

  startStadiumAmbience() {
    this.initContext();
    if (this.isAmbiencePlaying || !this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 4.0;
      const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);

      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < bufferSize; i++) {
          const t = i / this.ctx.sampleRate;
          const wave = Math.sin(t * 1.5) * 0.2 + Math.sin(t * 3.7) * 0.15 + (Math.random() * 0.65 - 0.32);
          data[i] = wave * 0.25;
        }
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(420, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.0, this.ctx.currentTime);

      this.crowdGainNode = this.ctx.createGain();
      const vol = this.getEffectiveVolume('crowd');
      this.crowdGainNode.gain.setValueAtTime(vol * 0.35, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.crowdGainNode);
      this.crowdGainNode.connect(this.ctx.destination);

      noise.start();
      this.crowdSourceNodes = [noise];
      this.isAmbiencePlaying = true;
    } catch (e) {}
  }

  stopStadiumAmbience() {
    if (this.crowdSourceNodes && this.crowdSourceNodes.length > 0) {
      this.crowdSourceNodes.forEach(node => {
        try { node.stop(); } catch (e) {}
      });
      this.crowdSourceNodes = [];
    }
    this.isAmbiencePlaying = false;
  }

  updateAmbienceVolume() {
    if (this.crowdGainNode && this.ctx) {
      const vol = this.getEffectiveVolume('crowd');
      this.crowdGainNode.gain.setValueAtTime(vol * 0.35, this.ctx.currentTime);
    }
  }

  // ==========================================
  // 2. SONS FORA DAS PARTIDAS (OFF-PITCH & UI)
  // ==========================================

  // Clique de Decisão
  playDecisionClick() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('sfx');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(vol * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Notificação Suave
  playNotification() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('event');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25].forEach((freq, i) => { // Dó e Mi
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(vol * 0.4, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.26);
    });
  }

  // Evolução de Atributo (+1) / Fanfarra Positiva
  playAttributeRise() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('event');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // Lá, Dó#, Mi, Lá agudo
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(vol * 0.45, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.32);
    });
  }

  // Queda de Atributo / Frustração
  playAttributeDrop() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('event');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const notes = [440, 370, 311];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(vol * 0.3, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.24);
    });
  }

  // Assinatura de Contrato / Apresentação
  playContractSigned() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const vol = this.getEffectiveVolume('event');
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // Acorde Maior Triunfante
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(vol * 0.5, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.52);
    });
  }

  // Conquista Desbloqueada / Troféu
  playAchievementUnlocked() {
    this.playContractSigned();
    setTimeout(() => this.playCheer(), 200);
  }

  // Controles
  setMasterVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    this.saveSettings();
    this.updateAmbienceVolume();
  }

  setSfxVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    this.saveSettings();
  }

  setCrowdVolume(val) {
    this.crowdVolume = Math.max(0, Math.min(1, val));
    this.saveSettings();
    this.updateAmbienceVolume();
  }

  setEventsVolume(val) {
    this.eventsVolume = Math.max(0, Math.min(1, val));
    this.saveSettings();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.saveSettings();
    this.updateAmbienceVolume();
    return this.isMuted;
  }
}

window.audioEngine = new AudioEngine();
