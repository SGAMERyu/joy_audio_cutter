class AudioPlayer {
  private ctx: AudioContext;
  private mediaSource!: MediaElementAudioSourceNode;
  constructor() {
    this.ctx = new AudioContext();
  }
  createPlayer(el: HTMLAudioElement) {
    this.mediaSource = this.ctx.createMediaElementSource(el);
  }
}

export default new AudioPlayer();
