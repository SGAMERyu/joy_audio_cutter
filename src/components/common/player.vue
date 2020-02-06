<template>
  <div class="player-wrapper">
    <audio :src="audioSrc" ref="audio"></audio>
    <button class="player-btn" @click="handleClick"></button>
    <!-- <button class="player-btn" @click="handleToggle"></button>
    <joy-slider class="player-slider" v-model="value"></joy-slider>
    <div class="player-duration">{{ duration }}</div> -->
  </div>
</template>

<script lang="ts">
import {
  createComponent,
  SetupContext,
  onMounted,
  ref,
  watch
} from "@vue/composition-api";

interface PlayerProps {
  file: File;
}

export default createComponent({
  name: "audioPlayer",
  props: {
    file: { required: true }
  },
  setup(props: PlayerProps, ctx: SetupContext) {
    let audioSrc = ref<string>();
    let audio = ref<HTMLAudioElement>();
    watch(
      () => props.file,
      (val: File) => {
        audioSrc.value = URL.createObjectURL(val);
      },
      { lazy: true }
    );
    function handleClick() {
      audio.value!.play();
    }
    return {
      audioSrc,
      audio,
      handleClick
    };
  }
});
</script>

<style lang="scss" scoped>
.player-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}
.player-btn {
  width: 24px;
  height: 24px;
  background: red;
  box-sizing: border-box;
  border: none;
  outline: none;
}
.player-slider {
  margin: 0 15px;
  flex: 0 1 auto;
}
.player-duration {
  color: #ffffff;
  text-align: center;
}
</style>
