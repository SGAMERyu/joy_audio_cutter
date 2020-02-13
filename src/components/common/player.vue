<template>
  <div class="player-wrapper">
    <audio :src="audioSrc" ref="audio"></audio>
    <div class="player-btn btn-play" @click="handleStart"></div>
    <div class="player-btn btn-pause" @click="handleStop"></div>
    <div class="player-slider">
      <joy-slider
        v-model="value"
        :max="state.duration"
        @change="handleSeek"
      ></joy-slider>
    </div>
    <div class="player-time">
      <span>{{ time }}</span>
      <span>/</span>
      <span>{{ duration }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  createComponent,
  SetupContext,
  onMounted,
  ref,
  watch,
  computed
} from "@vue/composition-api";
import { useAudio } from "../../hook";
import { durationToTime } from "../../shared/common";

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
    let value = ref<number>(0);
    const { setAudio, controls, state } = useAudio();
    const time = computed(() => {
      return durationToTime(state.time);
    });
    const duration = computed(() => {
      return durationToTime(state.duration);
    });
    onMounted(() => {
      setAudio(audio.value!);
    });
    watch(
      () => state.time,
      (val: number) => {
        value.value = val;
        ctx.emit("playAudio", val);
      },
      { lazy: true }
    );
    watch(
      () => props.file,
      (val: File) => {
        audioSrc.value = URL.createObjectURL(val);
      },
      { lazy: true }
    );
    function handleStart() {
      controls.value!.play();
    }
    function handleStop() {
      controls.value!.pause();
    }
    function handleSeek(time: number) {
      console.log("seek", time);
      controls.value.seek(time);
    }
    return {
      audioSrc,
      audio,
      handleStart,
      handleStop,
      time,
      state,
      duration,
      value,
      handleSeek
    };
  }
});
</script>

<style lang="scss" scoped>
.player-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}
.player-btn {
  width: 24px;
  height: 24px;
  box-sizing: border-box;
  border: none;
  outline: none;
  margin-right: 8px;
  cursor: pointer;
}
.btn-play {
  background-image: url("./assets/play.png");
  background-size: cover;
}
.btn-pause {
  background-image: url("./assets/pause.png");
  background-size: cover;
}
.player-slider {
  margin-right: 15px;
  flex: 1 0 auto;
}
.player-time {
  color: #ffffff;
  text-align: center;
}
</style>
