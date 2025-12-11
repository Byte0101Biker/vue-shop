import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Poczekaj aż Vue wystartuje, wtedy wybudź backend
router.isReady().then(() => {
  app.mount("#app");

  // 👇 WAŻNE: to wybudzi backend przy każdym wejściu na stronę
  fetch("https://vue-shop-u098.onrender.com/api/ping", { cache: "no-cache" })
    .then(() => console.log("Backend: awakened ✔️"))
    .catch(() => console.log("Backend still waking..."));
});
