import { ref, watch } from "@vue/composition-api";
import useApi from "./useApi";

export enum FileStatus {
  loading = "loading",
  success = "success",
  error = "error",
  removed = "removed"
}

export interface FileData {
  name: string;
  status: FileStatus;
  data: any;
}

interface ReadFileProps {
  transformFile: (file: File) => void;
  accept: RegExp;
}

export default function useReadFile(props: Partial<ReadFileProps> = {}) {
  const fileList = ref<Array<FileData>>([]);

  function addFileToFileList(mergeFileList: File[]) {
    mergeFileList.map(async file => {
      const currentFile: FileData = {
        name: file.name,
        status: FileStatus.loading,
        data: file
      };
      fileList.value.push(currentFile);
      try {
        if (props.transformFile) {
          const data = await props.transformFile(file);
          currentFile.data = data;
        }
      } catch (error) {
        currentFile.status = FileStatus.error;
      }
      currentFile.status = FileStatus.success;
    });
  }

  const readFileOnInput = (e: ProgressEvent) => {
    if (!e.target) return;
    const files = (e.target as HTMLInputElement).files;
    const mergeFileList = files ? Array.from(files) : [];
    addFileToFileList(mergeFileList);
  };

  const readFileOnDrag = (e: DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer) return;
    const { items = [] } = e.dataTransfer;
    const mergeFileList = Array.from(items)
      .filter(item => item.kind === "file" && item.type.match(/^audio\/*./))
      .map(item => item.getAsFile() as File);
    addFileToFileList(mergeFileList);
  };

  const readFileOnUrl = (url: string) => {
    const { run, state } = useApi({
      url,
      onSuccess: async val => {
        const blob = await val.blob();
        if (/audio/.test(blob.type)) {
          const fileType = blob.type.match(/audio\/(\w+)/)![1];
          const reg = new RegExp(`\\w+(?=\\.${fileType})`);
          const fileName = val.url.match(reg)![0];
          const file = new File([blob], fileName);
          addFileToFileList([file]);
        }
      }
    });
    run();
    return state;
  };

  return {
    fileList,
    readFileOnInput,
    readFileOnDrag,
    readFileOnUrl
  };
}
