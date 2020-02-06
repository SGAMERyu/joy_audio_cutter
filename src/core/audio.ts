interface AudioProps {
  duration: number;
  channelData: Float32Array;
  sampleRate: number;
}

class AudioEditor {
  private ctx: AudioContext;
  private bufferSource!: AudioBufferSourceNode;
  private _duration!: number;
  constructor() {
    this.ctx = new AudioContext();
  }
  get duration() {
    return this._duration;
  }
  async decodeBuffer(buffer: ArrayBuffer) {
    const audioBuffer = await this.ctx.decodeAudioData(buffer);
    return audioBuffer;
  }
  async createPlayer(audioBuffer: AudioBuffer) {
    this._duration = audioBuffer.duration;
    this.bufferSource = this.ctx.createBufferSource();
    this.bufferSource.buffer = audioBuffer;
    this.bufferSource.connect(this.ctx.destination);
  }
  play() {
    this.bufferSource.start(0);
  }
  pause() {
    this.bufferSource.stop();
  }
}

export default AudioEditor;
