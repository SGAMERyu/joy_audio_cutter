<template>
  <div class="joy-input">
    <input type="text" v-bind="$attrs" @input="handleInput" :value="value" />
  </div>
</template>

<script lang="ts">
import { createComponent, ref } from "@vue/composition-api";

export default createComponent({
  name: "JoyInput",
  props: {
    value: {
      type: String
    }
  },
  setup(props, ctx) {
    const handleInput = (e: Event) => {
      const { value } = e.target as HTMLInputElement;
      ctx.emit("input", value);
    };
    return {
      handleInput
    };
  }
});
</script>

<style lang="scss" scoped>
.joy-input {
  width: 100%;
  height: 32px;

  & input {
    display: block;
    width: 100%;
    height: 100%;
    padding: 4px 11px;
    border: 1px solid #17171f;
    outline: none;
    background: #3b3b4d;
    text-overflow: ellipsis;
    border-radius: 4px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.65);
  }
}
</style>
