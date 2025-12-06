<template>
    <div>
      <h2>👥 Lista użytkowników</h2>
  
      <div v-if="loading">⏳ Wczytywanie...</div>
  
      <ul v-else>
        <li v-for="u in users" :key="u.email">
          <strong>{{ u.email }}</strong> — rola: {{ u.role }}
        </li>
      </ul>
  
      <div v-if="error" style="color:red;">{{ error }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  
  const users = ref([]);
  const loading = ref(true);
  const error = ref("");
  
  onMounted(async () => {
    try {
      const res = await axios.get("https://vue-shop-u098.onrender.com/api/users");
      users.value = res.data;
    } catch (err) {
      error.value = "❌ Błąd przy pobieraniu użytkowników";
    } finally {
      loading.value = false;
    }
  });
  </script>
