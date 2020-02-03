import JoyDialog from "./dialog.vue";
import JoyInput from "./input.vue";
import JoySlider from "./slider.vue";

const components = [JoyDialog, JoyInput, JoySlider];

function install(vue: any) {
  components.forEach(component => {
    vue.component(component.name, component);
  });
}

export default {
  install
};
