<template>
    <div class="page">
      <h2>🏢 O firmie</h2>
      <p>{{ about }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  const about = ref("");
  
  onMounted(async () => {
    const res = await axios.get("https://vue-shop-u098.onrender.com/api/settings");
    about.value = res.data.pages.about;
  });
  </script>
  
  <style scoped>
  .page {
    max-width: 800px;
    margin: 2rem auto;
    background: #fff;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  }
  </style>
