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
import { useRender } from "../../hook";

interface RenderWaveProps {
  data: FileData;
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
    const { handleRender } = useRender();
    watch(
      () => props.data,
      val => {
        const { data } = val;
        handleRender(wrapper.value!, data);
      },
      { lazy: true }
    );
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
