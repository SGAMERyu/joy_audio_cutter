<template>
  <div class="joy-slider-scrollbar" ref="scrollBar" @click="handleClick">
    <div class="joy-slider-track" :style="trackStyle"></div>
    <div
      class="joy-slider-thumb"
      ref="thumb"
      @mousedown="handleDown"
      :style="thumbStyle"
    ></div>
  </div>
</template>

<script lang="ts">
import { createComponent, ref, computed, watch } from "@vue/composition-api";

export default createComponent({
  name: "joySlider",
  props: {
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    }
  },
  setup(props, ctx) {
    const scrollBar = ref<HTMLDivElement>();
    const { min, max } = props;
    let startX: number = 0;
    let newOffset: number = 0;
    let drag = false;

    const slideOffset = computed(() => {
      return (100 * props.value) / (max - min);
    });
    const trackStyle = computed(() => {
      return {
        width: `${(100 * slideOffset.value) / (max - min)}%`
      };
    });
    const thumbStyle = computed(() => {
      return {
        left: `${(100 * slideOffset.value) / (max - min)}%`
      };
    });

    function setValue(value: number) {
      if (value < min) {
        ctx.emit("input", min);
      }
      if (value > max) {
        ctx.emit("input", max);
      }
      if (value > min && value < max) {
        ctx.emit("input", value);
      }
    }

    function handleClick(e: MouseEvent) {
      if (drag) return;
      const { clientX } = e;
      const { width, left } = scrollBar.value!.getBoundingClientRect();
      const slideOffset = ((clientX - left) / width) * 100;
      setValue(slideOffset);
    }

    function handleDown(e: MouseEvent) {
      drag = true;
      startX = e.clientX;
      newOffset = slideOffset.value;
      window.addEventListener("mousemove", handleDraging);
      window.addEventListener("mouseup", handleDragEnd);
    }

    function handleDraging(e: MouseEvent) {
      const currentX = e.clientX;
      const width = scrollBar.value!.clientWidth;
      const diff = ((currentX - startX) / width) * 100;
      const slideOffset = diff + newOffset;
      setValue(slideOffset);
    }

    function handleDragEnd() {
      drag = false;
      window.removeEventListener("mousemove", handleDraging);
      window.removeEventListener("mouseup", handleDragEnd);
    }

    return {
      handleClick,
      scrollBar,
      thumbStyle,
      trackStyle,
      slideOffset,
      handleDown
    };
  }
});
</script>

<style lang="scss" scoped>
.joy-slider-scrollbar {
  position: relative;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.joy-slider-track {
  position: absolute;
  left: 0;
  width: 0;
  height: 6px;
  background: #1890ff;
}

.joy-slider-thumb {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: #1890ff;
  border-radius: 50%;
  cursor: pointer;
}
</style>
