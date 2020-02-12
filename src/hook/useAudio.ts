import { ref, reactive, toRefs, watch } from "@vue/composition-api";
import { durationToTime } from "@/shared/common";

interface Controls {
  play: Function;
  pause: Function;
  volume: Function;
  seek: Function;
}

interface State {
  duration: number;
  time: number;
}

export default function useAudio() {
  let refAudio = ref<HTMLAudioElement>();
  let controls = ref<Controls>({});
  let state = reactive<State>({
    duration: 0,
    time: 0
  });

  controls.value!.play = () => {
    refAudio.value!.play();
  };
  controls.value!.pause = () => {
    refAudio.value!.pause();
  };
  controls.value!.volume = (volume: number) => {
    refAudio.value!.volume = volume;
  };
  controls.value!.seek = (time: number) => {
    refAudio.value!.currentTime = time;
  };

  function setAudio(audio: HTMLAudioElement) {
    refAudio.value = audio;
    addListener();
  }

  function addListener() {
    refAudio.value!.addEventListener("timeupdate", () => {
      state.time = refAudio.value!.currentTime;
    });
    refAudio.value!.addEventListener("loadedmetadata", () => {
      state.duration = refAudio.value!.duration;
    });
  }

  return { setAudio, controls, state };
}
