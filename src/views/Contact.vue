<template>
    <div class="page">
      <h2>📞 Kontakt</h2>
      <p>{{ contact }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  const contact = ref("");
  
  onMounted(async () => {
    const res = await axios.get("http://localhost:3000/api/settings");
    contact.value = res.data.pages.contact;
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