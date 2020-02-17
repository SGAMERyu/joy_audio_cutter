import { transformBufferToWav } from "./codec";
// @ts-ignore
import toWav from "audiobuffer-to-wav";

class AudioEditor {
  private ctx: AudioContext;
  constructor() {
    this.ctx = new AudioContext();
  }
  async decodeBuffer(buffer: ArrayBuffer) {
    const audioBuffer = await this.ctx.decodeAudioData(buffer);
    return audioBuffer;
  }
  cutAudio(originBuffer: AudioBuffer, start: number, end: number) {
    const { sampleRate, numberOfChannels } = originBuffer;
    const length = (end - start) * sampleRate;
    const offlineCtx = new OfflineAudioContext(
      numberOfChannels,
      length,
      sampleRate
    );
    const cutAudioBuffer = offlineCtx.createBuffer(
      numberOfChannels,
      length,
      sampleRate
    );
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const originChannelData = originBuffer.getChannelData(channel);
      const cutChannelData = cutAudioBuffer.getChannelData(channel);
      const midData = originChannelData.subarray(
        start * sampleRate,
        end * sampleRate - 1
      );
      cutChannelData.set(midData);
    }

    const wav = transformBufferToWav(cutAudioBuffer);
    const file = new Blob([wav], { type: "audio/wav" });
    const download = document.createElement("a");
    download.download = "123";
    download.href = URL.createObjectURL(file);
    download.click();

    return cutAudioBuffer;
  }
  mergeAudio() {}
}

export default new AudioEditor();
