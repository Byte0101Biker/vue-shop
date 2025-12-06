#!/usr/bin/env node
/**
 * Skrypt tworzy kompletną strukturę projektu Vue 3 z Pinia, Router i Axios
 * Autor: ChatGPT dla Jakuba 😊
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const projectName = "vue-shop";
const projectPath = path.resolve(projectName);

console.log(`🛠️ Tworzenie nowego projektu Vue: ${projectName}\n`);

// 1️⃣ Utwórz projekt Vue
execSync(`npm create vite@latest ${projectName} -- --template vue`, { stdio: "inherit" });

// 2️⃣ Wejdź do folderu i zainstaluj zależności
process.chdir(projectPath);
console.log("\n📦 Instalacja zależności (pinia, vue-router, axios)...\n");
execSync(`npm install pinia vue-router axios`, { stdio: "inherit" });

// 3️⃣ Utwórz strukturę folderów
const folders = ["src/views", "src/store", "src/router"];
for (const f of folders) fs.mkdirSync(f, { recursive: true });

// 4️⃣ Plik routera
fs.writeFileSync(
  "src/router/index.js",
  `import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
`
);

// 5️⃣ Plik App.vue
fs.writeFileSync(
  "src/App.vue",
  `<template>
  <div class="app">
    <nav style="display:flex; gap: 1rem; background:#eee; padding: 1rem;">
      <router-link to="/">🏠 Home</router-link>
      <router-link to="/login">🔑 Login</router-link>
      <router-link to="/register">🧾 Register</router-link>
    </nav>
    <main style="padding:1rem;">
      <router-view />
    </main>
  </div>
</template>`
);

// 6️⃣ Plik main.js
fs.writeFileSync(
  "src/main.js",
  `import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
`
);

// 7️⃣ Home.vue
fs.writeFileSync(
  "src/views/Home.vue",
  `<template>
  <div>
    <h1>🛍️ Witaj w sklepie Vue!</h1>
    <p>To będzie Twój przyszły sklep internetowy 🚀</p>
  </div>
</template>`
);

// 8️⃣ Login.vue
fs.writeFileSync(
  "src/views/Login.vue",
  `<template>
  <div>
    <h2>Logowanie</h2>
    <form @submit.prevent="login">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Hasło" />
      <button>Zaloguj</button>
    </form>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const password = ref("");
const message = ref("");

async function login() {
  try {
    // na razie brak backendu, więc tylko komunikat
    message.value = "🔓 Zalogowano (symulacja)";
  } catch (e) {
    message.value = "❌ Błąd logowania";
  }
}
</script>`
);

// 9️⃣ Register.vue
fs.writeFileSync(
  "src/views/Register.vue",
  `<template>
  <div>
    <h2>Rejestracja</h2>
    <form @submit.prevent="register">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Hasło" />
      <button>Zarejestruj</button>
    </form>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const password = ref("");
const message = ref("");

async function register() {
  try {
    // na razie symulacja
    message.value = "🧾 Konto utworzone (symulacja)";
  } catch (e) {
    message.value = "❌ Błąd rejestracji";
  }
}
</script>`
);

// 🔟 Prosty store użytkownika (Pinia)
fs.writeFileSync(
  "src/store/user.js",
  `import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),
  actions: {
    login(email) {
      this.user = { email };
    },
    logout() {
      this.user = null;
    },
  },
});
`
);

console.log("\n✅ Projekt Vue został utworzony pomyślnie!");
console.log("👉 Uruchom go teraz:");
console.log("   cd vue-shop");
console.log("   npm run dev\n");
console.log("🌐 Otwórz w przeglądarce: http://localhost:5173\n");