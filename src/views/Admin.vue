<template>
    <div v-if="isAdmin" class="admin-panel">
      <h2>⚙️ Panel administracyjny</h2>
  
      <div v-if="loading" class="loading">⏳ Wczytywanie ustawień sklepu...</div>
      <div v-else-if="error" class="error">❌ {{ error }}</div>
  
      <div v-else-if="settings">
        <div class="tabs">
          <button @click="tab = 'general'" :class="{ active: tab === 'general' }">🎨 Wygląd</button>
          <button @click="tab = 'pages'" :class="{ active: tab === 'pages' }">📄 Strony</button>
          <button @click="tab = 'products'" :class="{ active: tab === 'products' }">🛍️ Produkty</button>
        </div>
  
        <!-- 🎨 WYGLĄD -->
        <section v-if="tab === 'general'">
          <h3>🎨 Ustawienia wyglądu strony</h3>
  
          <label>Logo sklepu:</label>
          <input type="file" @change="uploadLogo" />
          <img v-if="settings.logo" :src="settings.logo" class="logo-preview" alt="Logo sklepu" />
  
          <label>Tytuł:</label>
          <input v-model="settings.title" placeholder="Tytuł sklepu" />
  
          <label>Podtytuł:</label>
          <input v-model="settings.subtitle" placeholder="Opis / podtytuł sklepu" />
  
          <label>Kolor banera:</label>
          <input type="color" :value="settings.theme.bannerColor" @input="updateTheme('bannerColor', $event.target.value)" />
  
          <label>Kolor akcentu:</label>
          <input type="color" :value="settings.theme.accentColor" @input="updateTheme('accentColor', $event.target.value)" />
  
          <label>Czcionka:</label>
          <select :value="settings.theme.fontFamily" @change="updateTheme('fontFamily', $event.target.value)">
            <option value="'Inter', sans-serif">Inter</option>
            <option value="'Roboto', sans-serif">Roboto</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Lato', sans-serif">Lato</option>
            <option value="'Playfair Display', serif">Playfair Display</option>
          </select>
  
          <button @click="save" class="save-btn">💾 Zapisz zmiany</button>
        </section>
  
        <!-- 📄 STRONY -->
        <section v-if="tab === 'pages'">
          <h3>📄 Treści stron</h3>
          <h4>O firmie</h4>
          <textarea v-model="settings.pages.about" rows="5" placeholder="Wpisz treść sekcji 'O firmie'"></textarea>
  
          <h4>Kontakt</h4>
          <textarea v-model="settings.pages.contact" rows="5" placeholder="Wpisz treść sekcji 'Kontakt'"></textarea>
  
          <button @click="save" class="save-btn">💾 Zapisz treści</button>
        </section>
  
        <!-- 🛍️ PRODUKTY -->
        <section v-if="tab === 'products'">
          <h3>🛍️ Produkty</h3>
          <div v-for="p in settings.products" :key="p.id" class="product-edit">
            <input v-model="p.name" placeholder="Nazwa produktu" />
            <textarea v-model="p.description" placeholder="Opis produktu"></textarea>
            <input type="number" v-model.number="p.price" placeholder="Cena" />
  
            <div class="image-upload">
              <label>Zdjęcie produktu:</label>
              <input type="file" @change="uploadProductImage(p.id, $event)" />
              <img v-if="p.image" :src="p.image" alt="Podgląd" class="product-preview" />
            </div>
  
            <button @click="removeProduct(p.id)" class="remove-btn">❌ Usuń</button>
          </div>
  
          <button @click="addProduct" class="add-btn">➕ Dodaj produkt</button>
          <button @click="save" class="save-btn">💾 Zapisz zmiany</button>
        </section>
  
        <p class="message" v-if="message">{{ message }}</p>
      </div>
    </div>
  
    <div v-else class="no-access">
      <h2>🚫 Brak dostępu</h2>
      <router-link to="/login">Zaloguj się jako admin</router-link>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from "vue";
  import axios from "axios";
  import { useUserStore } from "../store/user";
  
  const userStore = useUserStore();
  const isAdmin = computed(() => userStore.user?.role === "admin");
  const settings = ref(null);
  const loading = ref(true);
  const error = ref("");
  const message = ref("");
  const tab = ref("general");
  
  onMounted(async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/settings");
      settings.value = res.data;
      if (!settings.value.theme) {
        settings.value.theme = {
          bannerColor: "#41b883",
          accentColor: "#35495e",
          fontFamily: "'Inter', sans-serif",
        };
      }
      applyTheme();
    } catch (err) {
      console.error(err);
      error.value = "Nie udało się wczytać ustawień.";
    } finally {
      loading.value = false;
    }
  });
  
  // 🔄 Aktualizacja stylu na żywo
  watch(
    () => settings.value?.theme,
    () => applyTheme(),
    { deep: true }
  );
  
  function updateTheme(key, value) {
    if (!settings.value.theme) settings.value.theme = {};
    settings.value.theme[key] = value;
    applyTheme();
  }
  
  function applyTheme() {
    if (!settings.value?.theme) return;
    const { bannerColor, accentColor, fontFamily } = settings.value.theme;
    document.documentElement.style.setProperty("--banner-color", bannerColor);
    document.documentElement.style.setProperty("--accent-color", accentColor);
    document.documentElement.style.setProperty("--font-family", fontFamily);
  }
  
  // 🧱 Produkty
  function addProduct() {
    if (!settings.value?.products) settings.value.products = [];
    settings.value.products.push({
      id: Date.now(),
      name: "Nowy produkt",
      description: "Opis produktu",
      price: 0,
      image: "",
    });
  }
  
  function removeProduct(id) {
    settings.value.products = settings.value.products.filter((p) => p.id !== id);
  }
  
  // 💾 Zapis ustawień
  async function save() {
    try {
      await axios.post("http://localhost:3000/api/settings", settings.value);
      message.value = "✅ Zapisano pomyślnie!";
      setTimeout(() => (message.value = ""), 3000);
    } catch (err) {
      console.error("Błąd zapisu:", err);
      message.value = "❌ Nie udało się zapisać zmian.";
    }
  }
  
  // 📸 Upload logo
  async function uploadLogo(event) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
  
    const res = await axios.post("http://localhost:3000/api/upload/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  
    settings.value.logo = res.data.logo;
    message.value = "✅ Logo zaktualizowane!";
    setTimeout(() => (message.value = ""), 3000);
  }
  
  // 📸 Upload zdjęcia produktu
  async function uploadProductImage(id, event) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
  
    const res = await axios.post(`http://localhost:3000/api/upload/product/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  
    const product = settings.value.products.find((p) => p.id === id);
    if (product) product.image = res.data.image;
  
    message.value = "✅ Zdjęcie produktu zapisane!";
    setTimeout(() => (message.value = ""), 3000);
  }
  </script>
  
  <style scoped>
  .admin-panel {
    max-width: 1000px;
    margin: 2rem auto;
    background: var(--banner-color);
    color: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: var(--font-family);
    transition: all 0.3s ease;
  }
  
  h2, h3, h4 {
    color: #fff;
  }
  
  .tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .tabs button {
    background: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.6rem 1rem;
    cursor: pointer;
    font-weight: 600;
    color: var(--accent-color);
    transition: 0.2s ease;
  }
  
  .tabs button.active {
    background: var(--accent-color);
    color: #fff;
  }
  
  input, select, textarea {
    display: block;
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    margin-top: 5px;
    border: 1px solid #ccc;
    font-family: var(--font-family);
  }
  
  .product-edit {
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .image-upload {
    margin-top: 10px;
  }
  
  .logo-preview {
    max-width: 150px;
    margin: 10px 0;
    border-radius: 6px;
    border: 2px solid #ccc;
    display: block;
  }
  
  .product-preview {
    max-width: 120px;
    margin-top: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  .add-btn,
  .save-btn {
    background: var(--accent-color);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0.6rem 1rem;
    margin-top: 1rem;
    cursor: pointer;
    font-weight: 600;
  }
  
  .remove-btn {
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0.4rem 0.8rem;
    cursor: pointer;
  }
  
  .message {
    text-align: center;
    color: #fff;
    font-weight: 600;
    margin-top: 1rem;
  }
  </style>