// src/store/cart.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: JSON.parse(localStorage.getItem("cart")) || [],
  }),
  getters: {
    totalPrice: (state) => state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    totalItems: (state) => state.items.reduce((sum, i) => sum + i.qty, 0),
  },
  actions: {
    addToCart(product) {
      const existing = this.items.find((i) => i.id === product.id);
      if (existing) existing.qty++;
      else this.items.push({ ...product, qty: 1 });
      this.save();
    },
    removeFromCart(id) {
      this.items = this.items.filter((i) => i.id !== id);
      this.save();
    },
    clearCart() {
      this.items = [];
      this.save();
    },
    save() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    },
  },
});