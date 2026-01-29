import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface CartItem {
  id: number;
  name: string;
  price: number;
}

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);
  const discount = ref(0);

  const totalPrice = computed(() => {
    const subtotal = items.value.reduce((sum, item) => sum + item.price, 0);
    return subtotal * (1 - discount.value / 100);
  });

  function addItem(item: CartItem) {
    items.value.push(item);
  }

  function clearCart() {
    items.value = [];
  }

  return {
    items,
    discount,
    totalPrice,
    addItem,
    clearCart,
  };
});
