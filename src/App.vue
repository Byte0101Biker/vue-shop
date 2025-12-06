<template>
  <div>
    <nav class="top-nav">
      <!-- 🏷️ Logo lub tytuł sklepu -->
      <div class="logo-container" @click="goHome">
        <img v-if="settings?.logo" :src="settings.logo" alt="Logo sklepu" class="logo" />
        <span v-else class="shop-title">{{ settings?.title || 'Vue Shop' }}</span>
      </div>

      <router-link to="/">🏠 Sklep</router-link>
      <router-link to="/cart">🛒 Koszyk ({{ totalItems }})</router-link>
      <router-link v-if="!user" to="/login">🔐 Login</router-link>
      <router-link v-if="user?.role === 'admin'" to="/admin">⚙️ Admin</router-link>
      <router-link v-if="user?.role === 'admin'" to="/admin-orders">📦 Zamówienia</router-link>
      <router-link v-if="user" to="/my-orders">📜 Moje zamówienia</router-link>
      <router-link to="/about">🏢 O firmie</router-link>
      <router-link to="/contact">📞 Kontakt</router-link>
      <button v-if="user" class="logout-btn" @click="logout">🚪 Wyloguj</button>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "./store/cart";
import { useUserStore } from "./store/user";
import { useRouter } from "vue-router";
import axios from "axios";

// 🛍️ Dane globalne
const cart = useCartStore();
const userStore = useUserStore();
const router = useRouter();
const settings = ref(null);

// 🧠 Reaktywne dane
const user = computed(() => userStore.user);
const totalItems = computed(() => cart.totalItems);

// 🚪 Wylogowanie
function logout() {
  userStore.logout();
  router.push("/");
}

// 🏠 Kliknięcie w logo
function goHome() {
  router.push("/");
}

// 🎨 Wczytanie ustawień wyglądu
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/settings");
    settings.value = res.data;
    applyTheme();
  } catch (err) {
    console.error("Błąd ładowania ustawień:", err);
  }
});

// 🎨 Funkcja do ustawiania kolorów i czcionki globalnie
function applyTheme() {
  if (!settings.value?.theme) return;
  const { bannerColor, accentColor, fontFamily } = settings.value.theme;
  document.documentElement.style.setProperty("--banner-color", bannerColor);
  document.documentElement.style.setProperty("--accent-color", accentColor);
  document.documentElement.style.setProperty("--font-family", fontFamily);
}
</script>

<style>
/* 🌈 Zmienne motywu */
:root {
  --banner-color: #41b883;
  --accent-color: #35495e;
  --font-family: "Inter", sans-serif;
}

/* 🩶 Ogólny wygląd strony */
body {
  font-family: var(--font-family);
  background-color: #f8f8f8;
  color: #333;
  margin: 0;
}

/* 🔝 Pasek nawigacji */
.top-nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  background: var(--banner-color);
  color: white;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.top-nav a {
  text-decoration: none;
  color: white;
  font-weight: 600;
  transition: color 0.2s ease;
}

.top-nav a:hover {
  color: #e6e6e6;
}

.top-nav a.router-link-exact-active {
  text-decoration: underline;
}

/* 🏷️ Logo i tytuł */
.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.logo {
  height: 40px;
  width: auto;
  border-radius: 5px;
  background: white;
  padding: 4px;
}

.shop-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
}

/* 🧭 Przycisk wylogowania */
.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
}
.logout-btn:hover {
  background: #c0392b;
}

/* 📦 Główna zawartość */
main {
  padding: 2rem;
}
</style>