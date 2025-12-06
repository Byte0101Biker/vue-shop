<template>
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
    const res = await axios.post("http://localhost:3000/api/register", {
      email: email.value,
      password: password.value,
    });
    message.value = res.data.message;
  } catch (err) {
    message.value = "❌ Błąd rejestracji — użytkownik może już istnieć!";
  }
}
</script>