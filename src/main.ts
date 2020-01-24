import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueCompositionApi from "@vue/composition-api";
import JoyUI from "@/shared/browser";

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);
Vue.use(JoyUI);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
