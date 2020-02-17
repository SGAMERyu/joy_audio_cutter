<template>
  <div class="home">
    <section class="home-file-list">
      <file-list @renderWave="setAudioFile"></file-list>
    </section>
    <section class="home-file-visual">
      <div class="home-render">
        <render-wave :file="audioFile" :time="time"></render-wave>
      </div>
      <div class="home-player">
        <audio-player :file="audioFile" @playAudio="sendTime"></audio-player>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import {
  createComponent,
  watch,
  onMounted,
  ref,
  reactive,
  provide
} from "@vue/composition-api";
import FileList from "@/components/home/fileList.vue";
import RenderWave from "@/components/common/render.vue";
import AudioPlayer from "@/components/common/player.vue";
import { FileData } from "../hook/useReadFile";
import audioEditor from "@/core/editor";
import { readFileToArrayBuffer } from "../shared/common";

export default createComponent({
  name: "Home",
  components: {
    FileList,
    RenderWave,
    AudioPlayer
  },
  setup() {
    let audioFile = ref<File>();
    let time = ref<number>(0);
    async function setAudioFile(file: FileData) {
      const { data } = file;
      audioFile.value = data;
      const buffer = await readFileToArrayBuffer(data);
      const audioBuffer = await audioEditor.decodeBuffer(buffer);
      audioEditor.cutAudio(audioBuffer, 0, 10);
    }
    function sendTime(val: number) {
      time.value = val;
    }

    return {
      audioFile,
      setAudioFile,
      sendTime,
      time
    };
  }
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  border: 4px solid rgba(66, 69, 88, 1);
}

.home-file-list {
  width: 300px;
  height: 400px;
  background: rgba(35, 41, 58, 1);
  box-sizing: border-box;
  color: #ffffff;
  border-right: 4px solid #424558;
}

.home-file-visual {
  flex: 1 0 auto;
  height: 400px;
  background: rgba(23, 26, 40, 1);
}

.home-render {
  height: 360px;
}

.home-player {
  background: #23293a;
  height: 40px;
  padding: 0 15px;
}
</style>
