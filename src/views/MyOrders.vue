<template>
    <div v-if="user" class="my-orders">
      <h2>📦 Moje zamówienia</h2>
  
      <div v-if="orders.length" class="orders-list">
        <div v-for="o in orders" :key="o.id" class="order-card">
          <header>
            <h3>Zamówienie #{{ o.id }}</h3>
            <span>{{ o.date }}</span>
          </header>
  
          <ul>
            <li v-for="item in o.items" :key="item.id">
              {{ item.name }} × {{ item.qty }} → {{ item.price * item.qty }} zł
            </li>
          </ul>
  
          <p class="total">💰 Razem: <strong>{{ o.total }} zł</strong></p>
        </div>
      </div>
  
      <p v-else>Nie masz jeszcze żadnych zamówień.</p>
    </div>
  
    <div v-else class="no-access">
      <h2>🚫 Zaloguj się, aby zobaczyć swoje zamówienia</h2>
      <router-link to="/login">🔐 Zaloguj się</router-link>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import axios from "axios";
  import { useUserStore } from "../store/user";
  
  const userStore = useUserStore();
  const user = computed(() => userStore.user);
  const orders = ref([]);
  
  onMounted(async () => {
    if (user.value?.email) {
      const res = await axios.get(`http://localhost:3000/api/orders/user/${user.value.email}`);
      orders.value = res.data;
    }
  });
  </script>
  
  <style scoped>
  .my-orders {
    max-width: 800px;
    margin: 2rem auto;
    background: #fff;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
    font-family: "Inter", system-ui, sans-serif;
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
  .no-access {
    text-align: center;
    margin-top: 3rem;
  }
  </style>