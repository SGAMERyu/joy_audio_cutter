interface AudioProps {
  duration: number;
  channelData: Float32Array;
  sampleRate: number;
}

class AudioEditor {
  private ctx: AudioContext;
  private audioProps!: AudioProps;
  constructor() {
    this.ctx = new AudioContext();
  }
  get duration() {
    return this.audioProps.duration;
  }
  get channelData() {
    return this.audioProps.channelData;
  }
  get sampleRate() {
    return this.audioProps.sampleRate;
  }
  async decodeBuffer(buffer: ArrayBuffer) {
    const audioBuffer = await this.ctx.decodeAudioData(buffer);
    const { duration, sampleRate } = audioBuffer;
    const channelData = audioBuffer.getChannelData(0);
    this.audioProps = { duration, sampleRate, channelData };
  }
}

export default AudioEditor;
