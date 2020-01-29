<template>
  <div class="renderWave-wrapper" ref="wrapper"></div>
</template>

<script lang="ts">
import {
  createComponent,
  PropType,
  watch,
  onMounted,
  Ref,
  SetupContext,
  ref
} from "@vue/composition-api";
import { FileData } from "../../hook/useReadFile";
import RenderWave from "../../core/render";

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
    const wrapper = ref<HTMLDivElement>();
    let render!: RenderWave;
    onMounted(() => {
      render = new RenderWave(wrapper.value!);
      render.render();
    });
    return {
      wrapper
    };
  }
});
</script>

<style lang="scss" scoped>
.renderWave-wrapper {
  width: 100%;
  height: 100%;
}
</style>
