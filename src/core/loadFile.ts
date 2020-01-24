function convertFileToArrayBuffer(file: File) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.addEventListener("load", () => {
      resolve(fileReader.result);
    });
  });
}

export async function loadUrlAudio(url: string) {
  const res = await fetch(url);
  const audioData = res.arrayBuffer();
  return audioData;
}
export async function loadLocalAudio(fileDom: HTMLInputElement) {
  const { files } = fileDom;
  if (!files) {
    return "no file";
  }
  const arrayBuffer = await convertFileToArrayBuffer(files[0]);
  return arrayBuffer;
}
export function loadDragAudio(e: DragEvent) {
  e.preventDefault();
  if (!e.dataTransfer) {
    return "no file";
  }
  const { items } = e.dataTransfer;
  const fileList = Array.from(items).map(item => {
    if (item.kind === "file" && item.type.match(/\.mp3/)) {
      return item.getAsFile();
    }
  });
  if (fileList && fileList[0] instanceof File) {
    const arrayBuffer = convertFileToArrayBuffer(fileList[0]!);
    return arrayBuffer;
  }
}
