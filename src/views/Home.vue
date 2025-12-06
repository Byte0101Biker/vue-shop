<template>
  <div class="shop" :style="{ fontFamily: settings?.theme?.fontFamily || 'Inter, sans-serif' }">
    
    <!-- 🏷️ Baner -->
    <header class="banner" :style="{ background: settings?.theme?.bannerColor || '#41b883' }">
      <div class="banner-content">
        <img v-if="settings.logo" :src="settings.logo" alt="Logo sklepu" class="banner-logo" />
        <h1>{{ settings.title || "Sklep z koszulkami 👕" }}</h1>
        <p>{{ settings.subtitle || "Najlepsze koszulki w sieci" }}</p>
        <router-link v-if="isAdmin" to="/admin" class="admin-link">⚙️ Edytuj sklep</router-link>
      </div>
    </header>

    <!-- 🛍️ Lista produktów -->
    <section v-if="settings.products?.length" class="product-grid">
      <div v-for="p in settings.products" :key="p.id" class="product-card">
        <div class="image-wrapper" :style="{ backgroundColor: p.color || settings.theme.accentColor || '#35495e' }">
          <img
            v-if="p.image"
            :src="p.image"
            :alt="p.name"
            class="product-image"
          />
          <div v-else class="no-image">Brak zdjęcia</div>
        </div>

        <div class="product-info">
          <h3>{{ p.name }}</h3>
          <p class="desc">{{ p.description }}</p>
          <div class="price">{{ p.price }} zł</div>
          <button
            class="buy-btn"
            :style="{ background: settings?.theme?.accentColor || '#41b883' }"
            @click="addToCart(p)"
          >
            🛒 Dodaj do koszyka
          </button>
        </div>
      </div>
    </section>

    <p v-else class="empty">🕐 Brak produktów w sklepie...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { useUserStore } from "../store/user";
import { useCartStore } from "../store/cart";

const settings = ref({});
const userStore = useUserStore();
const cart = useCartStore();
const isAdmin = computed(() => userStore.user?.role === "admin");

function addToCart(product) {
  cart.addToCart(product);
}

// 🔄 Wczytaj ustawienia
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/settings");
    settings.value = res.data;
    applyTheme();
  } catch (err) {
    console.error("Błąd ładowania ustawień:", err);
  }
});

// 🎨 Zastosuj motyw globalnie
function applyTheme() {
  if (!settings.value?.theme) return;
  const { bannerColor, accentColor, fontFamily } = settings.value.theme;
  document.documentElement.style.setProperty("--banner-color", bannerColor);
  document.documentElement.style.setProperty("--accent-color", accentColor);
  document.documentElement.style.setProperty("--font-family", fontFamily);
}

// Obserwuj zmiany motywu (live update)
watch(
  () => settings.value.theme,
  () => applyTheme(),
  { deep: true }
);
</script>

<style scoped>
.shop {
  background: #f9f9f9;
  min-height: 100vh;
  color: #333;
  transition: background 0.3s ease;
}

/* 🏷️ Baner */
.banner {
  text-align: center;
  color: white;
  padding: 2.5rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.banner-content {
  max-width: 800px;
  margin: 0 auto;
}

.banner-content h1 {
  font-size: 2.5rem;
  margin: 0.5rem 0;
}

.banner-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.banner-logo {
  max-height: 80px;
  margin-bottom: 1rem;
  border-radius: 6px;
  background: white;
  padding: 4px;
}

.admin-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  background: white;
  color: #333;
  border-radius: 5px;
  font-weight: 600;
  text-decoration: none;
}

/* 🛍️ Produkty */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
  position: relative;
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  color: white;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Opis produktu */
.product-info {
  padding: 1rem;
  text-align: center;
}

.product-info h3 {
  margin: 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.desc {
  font-size: 0.95rem;
  color: #555;
  min-height: 40px;
}

.price {
  margin-top: 0.8rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent-color);
}

/* Przycisk kupna */
.buy-btn {
  margin-top: 1rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
}

.buy-btn:hover {
  opacity: 0.9;
}

.empty {
  text-align: center;
  margin: 2rem;
  font-size: 1.2rem;
}

/* 📱 RESPONSYWNOŚĆ */

/* Telefony */
@media (max-width: 600px) {
  .banner-content h1 {
    font-size: 1.8rem;
  }

  .banner-content p {
    font-size: 1rem;
  }

  .product-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .product-card {
    border-radius: 10px;
  }
}

/* Tablety */
@media (min-width: 601px) and (max-width: 1024px) {
  .banner-content h1 {
    font-size: 2.2rem;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Duże ekrany */
@media (min-width: 1025px) {
  .banner-content h1 {
    font-size: 2.8rem;
  }

  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>