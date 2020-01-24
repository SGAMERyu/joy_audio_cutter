<template>
  <div id="app">
    <header class="app-headder">
      <h2>online_audio_cutter</h2>
    </header>
    <nav>
      <ul class="app-menu">
        <li>音频剪切</li>
        <li>音频合并</li>
        <li>音频提取</li>
        <li>音频转换</li>
        <li>音频录制</li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { createComponent } from "@vue/composition-api";

export default createComponent({
  name: "app"
});
</script>

<style lang="scss" scoped>
@import url("./style/index.scss");

.app-headder {
  padding: 0 30px;
  h2 {
    margin: 15px 0px;
    color: rgba(255, 255, 255, 1);
  }
}

.app-menu {
  display: inline-flex;
  align-items: center;
  height: 100%;
  width: 100%;
  height: 60px;
  margin: 0;
  padding: 0 30px;
  background: rgba(33, 38, 57, 1);
  & li {
    color: rgba(255, 255, 255, 1);
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>
