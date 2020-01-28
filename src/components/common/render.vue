<template>
  <div class="renderWave-wrapper"></div>
</template>

<script lang="ts">
import {
  createComponent,
  PropType,
  watch,
  onMounted,
  Ref,
  SetupContext
} from "@vue/composition-api";
import { FileData } from "../../hook/useReadFile";

interface RenderWaveProps {
  data: Ref<FileData>;
}

export default createComponent({
  name: "renderWave",
  props: {
    data: {
      type: Object as PropType<Ref<FileData>>,
      required: true,
      default() {
        return {};
      }
    }
  },
  setup(props: RenderWaveProps, ctx: SetupContext) {
    watch(
      () => props.data,
      val => {
        console.log(val);
      },
      { lazy: true }
    );
  }
});
</script>

<style lang="scss" scoped>
.renderWave-wrapper {
  width: 100%;
  height: 100%;
}
</style>
