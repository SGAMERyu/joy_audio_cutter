<template>
  <div class="renderWave-wrapper" ref="wrapper"></div>
</template>

<script lang="ts">
import {
  createComponent,
  PropType,
  watch,
  ref,
  SetupContext,
  onMounted
} from "@vue/composition-api";
import RenderWave from "../../core/render";

interface RenderProps {
  file: File;
  time: number;
}

export default createComponent({
  name: "render",
  props: {
    file: {
      required: true
    },
    time: {
      type: Number
    }
  },
  setup(props: RenderProps, ctx: SetupContext) {
    let wrapper = ref<HTMLDivElement>();
    let renderWave: RenderWave;
    onMounted(() => {
      renderWave = new RenderWave(wrapper.value!);
    });
    watch(
      () => props.file,
      async (val: File) => {
        await renderWave.initWaveData(val);
        renderWave.render();
      },
      {
        lazy: true
      }
    );
    watch(
      () => props.time,
      (val: number) => {
        renderWave.setTime(val);
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
