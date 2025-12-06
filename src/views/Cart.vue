<template>
    <div class="cart-page">
      <h2>🛒 Twój koszyk</h2>
  
      <div v-if="cart.items.length" class="cart-list">
        <div v-for="item in cart.items" :key="item.id" class="cart-item">
          <img v-if="item.image" :src="item.image" alt="produkt" />
          <div class="cart-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.price }} zł × {{ item.qty }}</p>
            <p><strong>{{ item.price * item.qty }} zł</strong></p>
            <button @click="cart.removeFromCart(item.id)">❌ Usuń</button>
          </div>
        </div>
  
        <div class="summary">
          <h3>Podsumowanie</h3>
          <p>🧾 Produkty: {{ cart.totalItems }}</p>
          <p>💰 Razem: <strong>{{ cart.totalPrice }} zł</strong></p>
  
          <form @submit.prevent="submitOrder" class="order-form">
            <h4>📦 Dane zamawiającego</h4>
            <input v-model="name" placeholder="Imię i nazwisko" required />
            <input v-model="email" placeholder="E-mail" required type="email" />
            <textarea v-model="address" placeholder="Adres dostawy" required></textarea>
  
            <button type="submit" class="order-btn">✅ Złóż zamówienie</button>
          </form>
  
          <p v-if="message" class="success">{{ message }}</p>
        </div>
      </div>
  
      <p v-else class="empty">Koszyk jest pusty 😢</p>
  
      <router-link to="/">⬅️ Wróć do sklepu</router-link>
    </div>
  </template>
  
  <script setup>
  import { useCartStore } from "../store/cart";
  import axios from "axios";
  import { ref } from "vue";
  
  const cart = useCartStore();
  const name = ref("");
  const email = ref("");
  const address = ref("");
  const message = ref("");
  
  async function submitOrder() {
    const order = {
      name: name.value,
      email: email.value,
      address: address.value,
      items: cart.items,
      total: cart.totalPrice,
    };
  
    await axios.post("http://localhost:3000/api/order", order);
    message.value = "🎉 Zamówienie zostało złożone! Dziękujemy!";
    cart.clearCart();
    name.value = email.value = address.value = "";
  }
  </script>
  
  <style scoped>
  .cart-page {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
    font-family: "Inter", system-ui, sans-serif;
  }
  .cart-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .cart-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #f8f8f8;
    border-radius: 8px;
    padding: 0.8rem;
  }
  .cart-item img {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
  }
  .summary {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f0f8f5;
    border-radius: 8px;
  }
  .order-form {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .order-form input,
  .order-form textarea {
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  .order-btn {
    margin-top: 0.8rem;
    background: #41b883;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0.6rem 1rem;
    cursor: pointer;
    font-weight: 600;
  }
  .success {
    text-align: center;
    margin-top: 1rem;
    color: #41b883;
    font-weight: 600;
  }
  </style>