import RenderWave from "@/core/render";
import AudioEditor from "@/core/audio";

export default function useRender() {
  async function handleRender(el: HTMLDivElement, buffer: ArrayBuffer) {
    const audioEditor = new AudioEditor();
    await audioEditor.decodeBuffer(buffer);
    const { sampleRate, channelData, duration } = audioEditor;
    const renderWave = new RenderWave(el, {
      channelData,
      sampleRate,
      endTime: 10,
      beginTime: 0
    });
    renderWave.render();
  }

  return {
    handleRender
  };
}
