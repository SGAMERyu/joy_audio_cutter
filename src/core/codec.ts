function mergeChannel(
  leftChannel: Float32Array,
  rightChannel: Float32Array | null
) {
  if (!rightChannel) return leftChannel;
  const length = leftChannel.length + rightChannel.length;
  const result = new Float32Array(length);
  let index = 0;
  let inputIndex = 0;

  while (index < length) {
    result[index++] = leftChannel[inputIndex];
    result[index++] = rightChannel[inputIndex];
    inputIndex++;
  }

  return result;
}

function writeString(view: DataView, string: string, offset: number) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export function transformBufferToWav(audioBuffer: AudioBuffer) {
  const { sampleRate, numberOfChannels } = audioBuffer;
  const leftChannel = audioBuffer.getChannelData(0);
  const rightChannel =
    numberOfChannels === 2 ? audioBuffer.getChannelData(1) : null;
  const channelDataAry = mergeChannel(leftChannel, rightChannel);
  const blockAlign = numberOfChannels * 2;
  const buffer = new ArrayBuffer(44 + channelDataAry.length * 2);
  const view = new DataView(buffer);
  let offset = 44;
  writeString(view, "RIFF", 0);
  view.setUint32(4, 36 + channelDataAry.length * 2, true);
  writeString(view, "WAVE", 8);
  writeString(view, "fmt ", 12);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, "data", 36);
  view.setUint32(40, channelDataAry.length * 2, true);
  for (let i = 0; i < channelDataAry.length; i++, offset += 2) {
    const data = Math.max(-1, Math.min(1, channelDataAry[i]));
    view.setUint16(offset, data < 0 ? data * 0x8000 : data * 0x7fff, true);
  }
  return buffer;
}
