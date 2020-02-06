<template>
  <section>
    <header class="file-list-header">
      <span>文件列表</span>
      <span>清空列表</span>
    </header>
    <main class="file-list-main">
      <ul>
        <li
          v-for="(file, index) in fileList"
          :key="index"
          @click="emitHome(file)"
        >
          <span class="file-name">{{ file.name }}</span>
          <span class="file-content" v-if="file.status === 'loading'">123</span>
        </li>
      </ul>
    </main>
    <footer class="file-list-footer">
      <input
        type="file"
        @change="readFileOnInput"
        ref="fileDom"
        multiple
        accept="audio/*"
      />
      <button @click="handleClick">添加文件</button>
      <button @click="openDialog">下载外链</button>
      <joy-dialog
        title="请输入下载链接"
        :visible.sync="visible"
        :onBeforeConfirm="handleLoad"
      >
        <joy-input placeholder="输入url" v-model="url"></joy-input>
      </joy-dialog>
    </footer>
  </section>
</template>

<script lang="ts">
import { createComponent, reactive, ref, watch } from "@vue/composition-api";
import { useReadFile, useApi } from "@/hook/index";
import { readFileToArrayBuffer } from "../../shared/common";
import { FileData } from "../../hook/useReadFile";

export default createComponent({
  name: "FileList",
  setup(props, ctx) {
    const fileDom = ref<HTMLInputElement>(null);
    const visible = ref<boolean>(false);
    const url = ref<string>("");
    const {
      fileList,
      readFileOnDrag,
      readFileOnInput,
      readFileOnUrl
    } = useReadFile();
    // methods
    function handleClick() {
      fileDom.value!.value = "";
      fileDom.value!.click();
    }

    function openDialog() {
      visible.value = true;
    }

    function handleLoad() {
      const state = readFileOnUrl(url.value);
      return new Promise((resolve, reject) => {
        watch(state.loading, val => {
          if (val) {
            resolve();
          }
        });
        watch(state.error, val => {
          if (val) {
            reject();
          }
        });
      });
    }

    function emitHome(file: FileData) {
      ctx.emit("renderWave", file);
    }

    return {
      url,
      visible,
      fileDom,
      fileList,
      readFileOnInput,
      handleClick,
      openDialog,
      handleLoad,
      emitHome
    };
  }
});
</script>

<style lang="scss" scoped>
.file-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 15px;
}
.file-list-main {
  height: 300px;
  overflow-y: auto;
  & ul {
    margin: 0;
    padding: 0;
  }
  & li {
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    background: rgba(32, 37, 54, 1);
    cursor: pointer;
    box-sizing: border-box;
    &:hover {
      background: rgba(41, 47, 67, 1);
    }
  }
  & .file-name {
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.file-list-footer {
  height: 50px;
  line-height: 50px;
  padding: 0 15px;
  & input {
    display: none;
  }
  & button {
    height: 32px;
    line-height: 32px;
    padding: 0px 15px;
    border: 1px solid #424558;
    margin-right: 15px;
    background: none;
    outline: none;
    color: #ffffff;
    box-sizing: border-box;
    cursor: pointer;
  }
}
</style>
