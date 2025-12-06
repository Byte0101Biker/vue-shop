<template>
    <div v-if="isAdmin" class="admin-orders">
      <h2>📦 Lista zamówień</h2>
  
      <div v-if="orders.length" class="orders-list">
        <div v-for="o in orders" :key="o.id" class="order-card">
          <header>
            <h3>Zamówienie #{{ o.id }}</h3>
            <span>{{ o.date }}</span>
          </header>
  
          <p><strong>Klient:</strong> {{ o.name }}</p>
          <p><strong>Email:</strong> {{ o.email }}</p>
          <p><strong>Adres:</strong> {{ o.address }}</p>
  
          <ul>
            <li v-for="item in o.items" :key="item.id">
              {{ item.name }} × {{ item.qty }} → {{ item.price * item.qty }} zł
            </li>
          </ul>
  
          <p class="total">💰 Razem: <strong>{{ o.total }} zł</strong></p>
          <button @click="remove(o.id)" class="remove-btn">❌ Usuń</button>
        </div>
      </div>
  
      <p v-else>Brak zamówień.</p>
    </div>
  
    <div v-else class="no-access">
      <h2>🚫 Brak dostępu</h2>
      <router-link to="/login">Zaloguj się jako admin</router-link>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import axios from "axios";
  import { useUserStore } from "../store/user";
  
  const userStore = useUserStore();
  const isAdmin = computed(() => userStore.user?.role === "admin");
  const orders = ref([]);
  
  onMounted(async () => {
    const res = await axios.get("https://vue-shop-u098.onrender.com/api/orders");
    orders.value = res.data;
  });
  
  async function remove(id) {
    if (confirm("Czy na pewno chcesz usunąć to zamówienie?")) {
      await axios.delete(`https://vue-shop-u098.onrender.com/api/orders/${id}`);
      orders.value = orders.value.filter((o) => o.id !== id);
    }
  }
  </script>
  
  <style scoped>
  .admin-orders {
    max-width: 900px;
    margin: 2rem auto;
    background: #fff;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  }
  .order-card {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
  }
  .order-card header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .order-card ul {
    margin: 0.5rem 0;
    padding-left: 1.2rem;
  }
  .total {
    font-weight: bold;
    color: #41b883;
  }
  .remove-btn {
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0.4rem 0.8rem;
    cursor: pointer;
  }
  </style>
