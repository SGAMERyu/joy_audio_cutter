<template>
  <div class="home">
    <section class="home-file-list">
      <file-list @renderWave="sendRender"></file-list>
    </section>
    <section class="home-file-visual">
      <render-wave :data="renderAudio"></render-wave>
    </section>
    <section class="home-file-tool"></section>
  </div>
</template>

<script lang="ts">
import { createComponent, watch, onMounted, ref } from "@vue/composition-api";
import { useReadFile } from "../hook";
import FileList from "@/components/home/fileList.vue";
import RenderWave from "@/components/common/render.vue";
import { FileData } from "../hook/useReadFile";

export default createComponent({
  name: "Home",
  components: {
    FileList,
    RenderWave
  },
  setup() {
    let renderAudio = ref<FileData>();
    function sendRender(file: FileData) {
      renderAudio.value = file;
    }

    return {
      renderAudio,
      sendRender
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
  min-height: 400px;
  background: rgba(35, 41, 58, 1);
  box-sizing: border-box;
  color: #ffffff;
}
.home-file-visual {
  flex: 1 0 auto;
  min-height: 400px;
  background: rgba(23, 26, 40, 1);
}
.home-file-tool {
  width: 300px;
  min-height: 400px;
  background: rgba(42, 46, 65, 1);
}
</style>
