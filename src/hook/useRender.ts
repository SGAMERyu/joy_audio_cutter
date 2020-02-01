import RenderWave from "@/core/render";
import AudioEditor from "@/core/audio";

export default function useRender() {
  async function handleRender(el: HTMLDivElement, buffer: ArrayBuffer) {
    const renderWave = new RenderWave(el);
    const audioEditor = new AudioEditor();
    await audioEditor.decodeBuffer(buffer);
    const { sampleRate, channelData, duration } = audioEditor;
    renderWave.render({ sampleRate, channelData, duration });
  }

  return {
    handleRender
  };
}
