interface AudioProps {
  duration: number;
  channelData: Float32Array;
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
  async decodeBuffer(buffer: ArrayBuffer) {
    const audioBuffer = await this.ctx.decodeAudioData(buffer);
    this.audioProps.duration = audioBuffer.duration;
    this.audioProps.channelData = audioBuffer.getChannelData(0);
  }
}
