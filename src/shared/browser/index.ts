import JoyDialog from "./dialog.vue";
import JoyInput from "./input.vue";

const components = [JoyDialog, JoyInput];

function install(vue: any) {
  components.forEach(component => {
    vue.component(component.name, component);
  });
}

export default {
  install
};
