<template>
  <div class="home">
    <section class="home-file-list">
      <file-list></file-list>
    </section>
    <section class="home-file-visual"></section>
    <section class="home-file-tool"></section>
  </div>
</template>

<script>
import { createComponent, watch, onMounted } from "@vue/composition-api";
import { useReadFile } from "../hook";
import FileList from "@/components/home/fileList";

export default createComponent({
  name: "Home",
  components: {
    FileList
  },
  setup() {}
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
