<template>
  <div class="login">
    <h2>🔐 Logowanie</h2>
    <form @submit.prevent="login">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Hasło" />
      <button>Zaloguj</button>
    </form>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "../store/user";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const message = ref("");
const userStore = useUserStore();
const router = useRouter();

async function login() {
  try {
    const res = await axios.post("https://vue-shop-u098.onrender.com/api/login", {
      email: email.value,
      password: password.value,
    });
    userStore.login(res.data.user);
    router.push("/");
  } catch {
    message.value = "❌ Nieprawidłowe dane logowania";
  }
}
</script>

<style>
.login {
  text-align: center;
  padding: 2rem;
}
.login input {
  display: block;
  margin: 0.5rem auto;
  padding: 0.4rem;
}
button {
  background-color: #41b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
