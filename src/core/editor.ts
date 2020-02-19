import { transformBufferToWav } from "./codec";

function mergeArray(ary: Float32Array[]) {
  const length = ary.length * ary[0].length;
  const data = new Float32Array(length);
  let offset = 0;
  for (let i = 0; i < ary.length - 1; i++) {
    data.set(ary[i], offset);
    offset += ary[i].length;
  }
  return data;
}

class AudioEditor {
  private ctx: AudioContext;
  constructor() {
    this.ctx = new AudioContext();
  }
  async decodeBuffer(buffer: ArrayBuffer) {
    const audioBuffer = await this.ctx.decodeAudioData(buffer);
    return audioBuffer;
  }
  extractAudio(originBuffer: AudioBuffer, start: number, end: number) {
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
    return cutAudioBuffer;
  }
  cutAudio(audioBuffer: AudioBuffer, startTime: number, endTime: number) {
    const { numberOfChannels, sampleRate, duration } = audioBuffer;
    const length = (duration - (endTime - startTime)) * sampleRate;
    const offlineCtx = new OfflineAudioContext(
      numberOfChannels,
      length,
      sampleRate
    );
    const newAudioBuffer = offlineCtx.createBuffer(
      numberOfChannels,
      length,
      sampleRate
    );
    for (let i = 0; i < numberOfChannels; i++) {
      const originChannelData = audioBuffer.getChannelData(i);
      const newChannelData = newAudioBuffer.getChannelData(i);
      const beforeCutData = originChannelData.subarray(
        0,
        startTime * sampleRate - 1
      );
      const afterCutData = originChannelData.subarray(endTime * sampleRate);
      newChannelData.set(beforeCutData);
      newChannelData.set(afterCutData, startTime * sampleRate);
    }
    return transformBufferToWav(newAudioBuffer);
  }
  mergeAudio(originBuffer1: AudioBuffer, originBuffer2: AudioBuffer) {
    const {
      sampleRate: sampleRate1,
      numberOfChannels: numberOfChannels1,
      duration: duration1
    } = originBuffer1;
    const {
      sampleRate: sampleRate2,
      numberOfChannels: numberOfChannels2,
      duration: duration2
    } = originBuffer2;
    const numberOfChannels =
      numberOfChannels1 >= numberOfChannels2
        ? numberOfChannels1
        : numberOfChannels2;
    const length = duration1 * sampleRate1 + duration2 * sampleRate2;
    const offlineCtx = new OfflineAudioContext({
      numberOfChannels,
      length,
      sampleRate: sampleRate1
    });
    const newAudioBuffer = offlineCtx.createBuffer(
      numberOfChannels,
      length,
      sampleRate1
    );
    for (let i = 0; i < numberOfChannels; i++) {
      const originChannelAry1 = originBuffer1.getChannelData(i);
      const originChannelAry2 = originBuffer1.getChannelData(i);
      const newChannelAry = newAudioBuffer.getChannelData(i);
      const mergeData1 = originChannelAry1.subarray(0);
      const mergeData2 = originChannelAry2.subarray(0);
      newChannelAry.set(mergeData1);
      newChannelAry.set(mergeData2, duration1 * sampleRate1);
    }
    return transformBufferToWav(newAudioBuffer);
  }
  async recordAudio() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 44100,
        channelCount: 2,
        volume: 1.0
      }
    });
    const leftChannelData: Float32Array[] = [];
    const rightChannelData: Float32Array[] = [];
    const mediaStreamSource = this.ctx.createMediaStreamSource(mediaStream);
    const scriptSource = this.ctx.createScriptProcessor(4096, 2, 2);
    scriptSource.onaudioprocess = function(e: AudioProcessingEvent) {
      const { inputBuffer } = e;
      leftChannelData.push(inputBuffer.getChannelData(0).slice(0));
      rightChannelData.push(inputBuffer.getChannelData(1).slice(0));
    };
    mediaStreamSource.connect(scriptSource);
    scriptSource.connect(this.ctx.destination);
    return () => {
      const audioTrack = mediaStream.getAudioTracks();
      audioTrack[0].stop();
      mediaStreamSource.disconnect();
      scriptSource.disconnect();
      return this.creatRecordAudio(leftChannelData, rightChannelData);
    };
  }
  creatRecordAudio(
    leftChannelData: Float32Array[],
    rightChannelData: Float32Array[]
  ) {
    const leftData = mergeArray(leftChannelData);
    const rightData = mergeArray(rightChannelData);
    const length = leftData.length + rightData.length;
    const offlineCtx = new OfflineAudioContext({
      numberOfChannels: 2,
      length,
      sampleRate: 44100
    });
    const audioBuffer = offlineCtx.createBuffer(2, length, 44100);
    const leftChannel = audioBuffer.getChannelData(0);
    const rightChannel = audioBuffer.getChannelData(1);
    leftChannel.set(leftData);
    rightChannel.set(rightData);
    return transformBufferToWav(audioBuffer);
  }
}

export default new AudioEditor();
